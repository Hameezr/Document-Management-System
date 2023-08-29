import { DocumentDTO, NewDocumentDto } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataSchema } from "../../domain/valueObjects/MetadataVO";
import { Request } from "express";
import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import TYPES from "../../infrastructure/DIContainer/types";

import sharp from 'sharp';
import { parseBuffer } from 'music-metadata';
import pdf from 'pdf-parse';

@injectable()
export class DocumentService {
  constructor(@inject(TYPES.DocumentRepository) private documentRepository: DocumentRepository) { }

  async createDocument(req: Request): Promise<AppResult<DocumentDTO>> {
    const newDocumentDtoResult = await this.processFile(req);
    if (newDocumentDtoResult.isOk()) {
      const documentEntity = DocumentEntity.createFromDTO(newDocumentDtoResult.unwrap());
      await this.documentRepository.create(documentEntity);
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    } else {
      return newDocumentDtoResult;
    }
  }

  async getAllDocuments(): Promise<AppResult<DocumentEntity[]>> {
    const documents = await this.documentRepository.findAll();
    return AppResult.Ok(documents);
  }

  async getDocumentById(id: string): Promise<AppResult<DocumentDTO>> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    }
    return AppResult.Err(AppError.NotFound(`Document with ID ${id} not found`));
  }

  async updateDocument(req: Request, documentId: string): Promise<AppResult<DocumentDTO>> {
    const documentDtoResult = await this.processFile(req);
    if (documentDtoResult.isErr()) {
      return documentDtoResult;
    }

    const existingDocument = await this.documentRepository.findById(documentId);
    if (!existingDocument) {
      return AppResult.Err(AppError.NotFound(`Document with ID ${documentId} not found`));
    }

    const updatedDocumentEntity = DocumentEntity.createFromDTO(documentDtoResult.unwrap());

    if (req.file) {
      const newFileType = req.file.mimetype?.split("/")[0] || '';
      if (newFileType !== updatedDocumentEntity.file.metadata.type) {
        return AppResult.Err(AppError.InvalidData('Metadata type does not match the new file type'));
      }
    }

    existingDocument.title = updatedDocumentEntity.title;
    existingDocument.file = updatedDocumentEntity.file;
    existingDocument.author = updatedDocumentEntity.author;
    existingDocument.setUpdatedAt(new Date());

    await this.documentRepository.update(existingDocument);
    return AppResult.Ok(DocumentDTO.from(existingDocument));
  }

  async deleteDocument(id: string): Promise<AppResult<void>> {
    const existingDocument = await this.documentRepository.findById(id);
    if (!existingDocument) {
      return AppResult.Err(AppError.NotFound("Document not found"));
    }
    await this.documentRepository.delete(id);
    return AppResult.Ok(undefined); // App result requires an argument even if it is void, hence passing undefined
  }

  private async processFile(req: Request): Promise<AppResult<NewDocumentDto>> {
    const { title, tags, author } = req.body;
    const { originalname, mimetype } = req.file || {};
    // const tagsArray = JSON.parse(tags);
    let tagsArray: any = [];
    const fileType = mimetype?.split("/")[0] || ''; // Extract file type from content type (e.g., "image/png" -> "image")

    if (!req.file) {
      return AppResult.Err(AppError.InvalidData("No file provided"));
    }
    try {
      if (tags) {
        tagsArray = JSON.parse(tags);
      }
    } catch (e) {
      return AppResult.Err(AppError.InvalidData("Invalid tags format"));
    }

    let existingDocumentData;
    if (req.params.id) {
      const existingDocumentResult = await this.getDocumentById(req.params.id);
      if (existingDocumentResult.isOk()) {
        existingDocumentData = existingDocumentResult.unwrap().serialize();
      }
    }
    const existingMetadata = existingDocumentData?.file.metadata;

    let metadata: MetadataSchema;
    if (req.body.metadata) {
      const parsedMetadata = JSON.parse(req.body.metadata);
      metadata = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes);
      try {
        metadata.validateAttributes();
      } catch (err) {
        return AppResult.Err(AppError.InvalidData('Invalid metadata provided'));
      }
    }
    else if (!req.file && existingMetadata) {
      metadata = existingMetadata;
    } else {
      // Placeholder for dynamically determined attributes
      let dynamicAttributes = {};

      // Image metadata extraction
      if (fileType === 'image') {
        const imageMetadata = await sharp(req.file?.buffer).metadata();
        dynamicAttributes = {
          resolution: `${imageMetadata.width}x${imageMetadata.height}`,
          colorDepth: `${imageMetadata.channels} channels`,
          format: imageMetadata.format
        };
      }
      // Audio metadata extraction
      if (fileType === 'audio' && req.file?.buffer) {
        const audioMetadata = await parseBuffer(req.file?.buffer, 'audio/mpeg');
        dynamicAttributes = {
          duration: audioMetadata.format.duration,
          bitrate: audioMetadata.format.bitrate,
          channels: audioMetadata.format.numberOfChannels
        };
      }

      // PDF metadata extraction
      if (fileType === 'application') {
        // PDF metadata extraction
        if (req.file?.mimetype === 'application/pdf') {
          const data = await pdf(req.file.buffer);
          dynamicAttributes = {
            pages: data.numpages,
            version: data.info.PDFFormatVersion
          };
        }
      }
      const attributesArray = Object.entries(dynamicAttributes).map(
        ([key, value]) => `${key}: ${value}`
      );

      // Finally, creating the MetadataSchema
      metadata = MetadataSchema.createFromAttributes(fileType, attributesArray);
    }

    const newDocumentDtoValidationResult = NewDocumentDto.create({
      title,
      file: {
        fileName: originalname || '',
        fileExtension: originalname?.split(".").pop() || "",
        contentType: mimetype || '',
        tags: tagsArray,
        metadata
      },
      author
    });

    if (newDocumentDtoValidationResult.isErr()) {
      const validationError = newDocumentDtoValidationResult.unwrapErr();
      return AppResult.Err(AppError.InvalidData(validationError.message));
    }
    return AppResult.Ok(newDocumentDtoValidationResult.unwrap());
  }
}
