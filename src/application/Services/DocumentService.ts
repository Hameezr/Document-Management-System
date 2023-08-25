import { DocumentDTO, NewDocumentDto } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataService } from "./MetadataService";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository, private metadataService: MetadataService) { }

  async createDocument(documentEntity: DocumentEntity): Promise<void> {
    await this.documentRepository.create(documentEntity);
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
}
