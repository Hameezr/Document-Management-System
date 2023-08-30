import { DocumentDTO, NewDocumentDto } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../domain/entities/DocumentRepo.interface"
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataSchema } from "../../domain/valueObjects/MetadataVO";
import { Request } from "express";
import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import { logGenericMessage } from "../../infrastructure/logger/logger";
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
      logGenericMessage('Service', 'Created');
      const documentEntity = DocumentEntity.createFromDTO(newDocumentDtoResult.unwrap());
      await this.documentRepository.create(documentEntity);
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    } else {
      logGenericMessage('Service', 'Create', 'error');
      return newDocumentDtoResult;
    }
  }

  async getAllDocuments(): Promise<AppResult<DocumentEntity[]>> {
    const documents = await this.documentRepository.findAll();
    logGenericMessage('Service', 'FetchAll');
    return AppResult.Ok(documents);
  }

  async getDocumentById(id: string): Promise<AppResult<DocumentDTO>> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      logGenericMessage('Service', 'FetchById');
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    }
    logGenericMessage('Service', 'FetchById', 'error');
    return AppResult.Err(AppError.NotFound(`Document with ID ${id} not found`));
  }

  async updateDocument(req: Request, documentId: string): Promise<AppResult<DocumentDTO>> {
    const documentDtoResult = await this.processFile(req);
    if (documentDtoResult.isErr()) {
      logGenericMessage('Service', 'Update', 'error');
      return documentDtoResult;
    }

    const existingDocument = await this.documentRepository.findById(documentId);
    if (!existingDocument) {
      return AppResult.Err(AppError.NotFound(`Document with ID ${documentId} not found`));
    }

    const updatedDocumentEntity = DocumentEntity.createFromDTO(documentDtoResult.unwrap());

    existingDocument.title = updatedDocumentEntity.title;
    existingDocument.file = updatedDocumentEntity.file;
    existingDocument.author = updatedDocumentEntity.author;
    existingDocument.setUpdatedAt(new Date());

    await this.documentRepository.update(existingDocument);
    logGenericMessage('Service', 'Update');
    return AppResult.Ok(DocumentDTO.from(existingDocument));
  }

  async deleteDocument(id: string): Promise<AppResult<void>> {
    const existingDocument = await this.documentRepository.findById(id);
    if (!existingDocument) {
      logGenericMessage('Service', 'Delete', 'error');
      return AppResult.Err(AppError.NotFound("Document not found"));
    }
    await this.documentRepository.delete(id);
    logGenericMessage('Service', 'Delete');
    return AppResult.Ok(undefined); // App result requires an argument even if it is void, hence passing undefined
  }

  private validateAndParseTags(tags: string): any[] {
    let tagsArray: any = [];
    try {
      if (tags) {
        tagsArray = JSON.parse(tags);
      }
    } catch (e) {
      throw new Error("Invalid tags format");
    }
    return tagsArray;
  }

  private validateAndParseMetadata(metadata: string, fileType: string): MetadataSchema {
    const parsedMetadata = JSON.parse(metadata);
    const metadataSchema = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes);
    metadataSchema.validateAttributes();
    if (metadataSchema.type !== fileType) {
      throw new Error('Metadata type does not match the file type');
    }
    return metadataSchema;
  }

  private async extractDynamicMetadata(fileType: string, fileBuffer: Buffer): Promise<any> {
    let dynamicAttributes = {};
  
    // Image metadata extraction
    if (fileType === 'image') {
      const imageMetadata = await sharp(fileBuffer).metadata();
      dynamicAttributes = {
        resolution: `${imageMetadata.width}x${imageMetadata.height}`,
        colorDepth: `${imageMetadata.channels} channels`,
        format: imageMetadata.format
      };
    }
  
    // Audio metadata extraction
    if (fileType === 'audio') {
      const audioMetadata = await parseBuffer(fileBuffer, 'audio/mpeg');
      dynamicAttributes = {
        duration: audioMetadata.format.duration,
        bitrate: audioMetadata.format.bitrate,
        channels: audioMetadata.format.numberOfChannels
      };
    }
  
    // PDF metadata extraction
    if (fileType === 'application') {
      const data = await pdf(fileBuffer);
      dynamicAttributes = {
        pages: data.numpages,
        version: data.info.PDFFormatVersion
      };
    }
    const attributesArray = Object.entries(dynamicAttributes).map(
      ([key, value]) => `${key}: ${value}`
    );
  
    return attributesArray;
  }
  

  private async processFile(req: Request): Promise<AppResult<NewDocumentDto>> {
    const { title, author } = req.body;
    const { originalname, mimetype } = req.file || {};
    const fileType = mimetype?.split("/")[0] || '';

    if (!req.file) {
      return AppResult.Err(AppError.InvalidData("No file provided"));
    }

    let tagsArray;
    try {
      tagsArray = this.validateAndParseTags(req.body.tags);
    } catch (e) {
      if (e instanceof Error) {
        return AppResult.Err(AppError.InvalidData(e.message));
      } else {
        return AppResult.Err(AppError.InvalidData('An unknown error occurred'));
      }
    }
    

    let metadata: MetadataSchema;
    try {
      if (req.body.metadata) {
        metadata = this.validateAndParseMetadata(req.body.metadata, fileType);
      } else {
        const dynamicAttributes = await this.extractDynamicMetadata(fileType, req.file.buffer);
        metadata = MetadataSchema.createFromAttributes(fileType, dynamicAttributes);
      }
    } catch (e) {
      if (e instanceof Error) {
        return AppResult.Err(AppError.InvalidData(e.message));
      } else {
        return AppResult.Err(AppError.InvalidData('An unknown error occurred'));
      }
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
