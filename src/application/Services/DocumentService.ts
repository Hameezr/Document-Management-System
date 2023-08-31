import { Request } from "express";
import { DocumentDTO } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../domain/entities/DocumentRepo.interface"
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { ProcessFileService } from "./ProcessFileService";
import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import { logGenericMessage } from "../../infrastructure/logger/logger";
import TYPES from "../../infrastructure/DIContainer/types";


@injectable()
export class DocumentService {
  constructor(@inject(TYPES.DocumentRepository) private documentRepository: DocumentRepository,
    @inject(TYPES.ProcessFileService) private processFileService: ProcessFileService) { }

  async createDocument(req: Request): Promise<AppResult<DocumentDTO>> {
    const newDocumentDtoResult = await this.processFileService.processFile(req);
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
    const documentDtoResult = await this.processFileService.processFile(req);
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
}
