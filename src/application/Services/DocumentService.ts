import { DocumentDTO, NewDocumentDto } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataSchema } from "../../domain/entities/MetadataEntity";
import { Request } from "express";

import sharp from 'sharp';
import { parseBuffer } from 'music-metadata';
import pdf from 'pdf-parse';


export class DocumentService {
  constructor(private documentRepository: DocumentRepository) { }

  async createDocument(newDocumentDto: NewDocumentDto): Promise<DocumentEntity> {
    const documentEntity = DocumentEntity.createFromDTO(newDocumentDto);
    await this.documentRepository.create(documentEntity);
    return documentEntity;
  }

  async getAllDocuments(): Promise<DocumentEntity[]> {
    return await this.documentRepository.findAll();
  }

  async getDocumentById(id: string): Promise<DocumentDTO | null> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      return DocumentDTO.from(documentEntity);
    }
    return null;
  }

  async updateDocument(documentDTO: NewDocumentDto, documentId: string): Promise<void> {
    const existingDocument = await this.documentRepository.findById(documentId);
    if (!existingDocument) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    const updatedDocumentEntity = DocumentEntity.createFromDTO(documentDTO);

    existingDocument.title = updatedDocumentEntity.title;
    existingDocument.file = updatedDocumentEntity.file;
    existingDocument.author = updatedDocumentEntity.author;
    existingDocument.setUpdatedAt(new Date());

    await this.documentRepository.update(existingDocument);
  }

  async deleteDocument(id: string): Promise<void> {
    const existingDocument = await this.documentRepository.findById(id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    await this.documentRepository.delete(id);
  }

  async processFile(req: Request): Promise<NewDocumentDto> {
    const { title, tags, author } = req.body;
    const { originalname, mimetype } = req.file || {};
    const tagsArray = JSON.parse(tags);
    const fileType = mimetype?.split("/")[0] || ''; // Extract file type from content type (e.g., "image/png" -> "image")
    let existingDocument
    if (req.params.id) {
      existingDocument = await this.getDocumentById(req.params.id);
    }
    const existingDocumentData = existingDocument?.serialize();
    const existingMetadata = existingDocumentData?.file.metadata;


    let metadata: MetadataSchema;
    if (req.body.metadata) {
      const parsedMetadata = JSON.parse(req.body.metadata);
      metadata = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes);
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

    return NewDocumentDto.create({
      title,
      file: {
        fileName: originalname || '',
        fileExtension: originalname?.split(".").pop() || "",
        contentType: mimetype || '',
        tags: tagsArray,
        metadata
      },
      author
    }).unwrap();
  }
}
