import { DocumentDTO } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataService } from "./MetadataService";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository, private metadataService: MetadataService) { }

  async createDocument(documentEntity: DocumentEntity): Promise<void> {
    await this.documentRepository.create(documentEntity);
  }

  async getDocumentById(id: string): Promise<DocumentDTO | null> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      return DocumentDTO.from(documentEntity);
    }
    return null;
  }



  //   async updateDocument(documentDTO: DocumentDTO): Promise<void> {
  //     const existingDocument = await this.documentRepository.findById(documentDTO.id);
  //     if (!existingDocument) {
  //       throw new Error(`Document with ID ${documentDTO.id} not found`);
  //     }    
  //     const updatedDocumentEntity = DocumentEntity.fromDTO(documentDTO);  // Use static method to create DocumentEntity from DTO
  //     await this.documentRepository.update(updatedDocumentEntity);
  // }


  async deleteDocument(id: string): Promise<void> {
    const existingDocument = await this.documentRepository.findById(id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    await this.documentRepository.delete(id);
  }
}
