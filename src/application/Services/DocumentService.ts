import { Request } from "express";
import { DocumentDTO } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../domain/entities/Document/DocumentRepo.interface"
import { DocumentEntity } from "../../domain/entities/Document/DocumentEntity";
import { ProcessFileService } from "./ProcessFileService";
import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import TYPES from "../../infrastructure/DIContainer/types";


@injectable()
export class DocumentService {
  constructor(@inject(TYPES.DocumentRepository) private documentRepository: DocumentRepository,
    @inject(TYPES.ProcessFileService) private processFileService: ProcessFileService) { }

  async createDocument(req: Request): Promise<AppResult<DocumentDTO>> {
    
    const newDocumentDtoResult = await this.processFileService.processFile(req);
    if (newDocumentDtoResult.isOk()) {
      const documentEntity = DocumentEntity.createFromDTO(newDocumentDtoResult.unwrap());
      await this.documentRepository.create(documentEntity);
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    } else {
      return newDocumentDtoResult;
    }
  }

  async getAllDocuments(page: number): Promise<AppResult<{ documents: DocumentEntity[], total: number, currentPage: number, pageSize: number }>> {
    if (page < 1) {
      return AppResult.Err(new Error("Page number cannot be less than 1"));
    }

    const pageSize = 5;
    const skip = (page - 1) * pageSize;
    const result = await this.documentRepository.findAll(skip, pageSize);

    if (result.documents.length === 0 && result.total > 0) {
      return AppResult.Err(new Error("No documents exist on this page"));
    }
    return AppResult.Ok(result);
  }



  async getDocumentById(id: string): Promise<AppResult<DocumentDTO>> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      return AppResult.Ok(DocumentDTO.from(documentEntity));
    }
    return AppResult.Err(AppError.NotFound(`Document with ID ${id} not found`));
  }

  async updateDocument(req: Request, documentId: string): Promise<AppResult<DocumentDTO>> {
    const documentDtoResult = await this.processFileService.processFile(req);
    if (documentDtoResult.isErr()) {
      return documentDtoResult;
    }

    const existingDocument = await this.documentRepository.findById(documentId);
    if (!existingDocument) {
      return AppResult.Err(AppError.NotFound(`Document with ID ${documentId} not found`));
    }

    // Checking content type of the new file if it matches the existing document's content type
    const newContentType = documentDtoResult.unwrap().data.file.contentType;
    const existingContentType = existingDocument.file.contentType;
    const newFileType = newContentType.split("/")[0];
    const existingFileType = existingContentType.split("/")[0];

    if (newFileType !== existingFileType) {
      return AppResult.Err(AppError.InvalidData(`Cannot change the file type from ${existingFileType} to ${newFileType}`));
    }

    const updatedDocumentEntity = DocumentEntity.createFromDTO(documentDtoResult.unwrap());

    existingDocument.title = updatedDocumentEntity.title;
    existingDocument.file = updatedDocumentEntity.file;
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
}
