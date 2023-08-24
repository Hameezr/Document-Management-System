import { DocumentDTO } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataService } from "./MetadataService";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository, private metadataService: MetadataService) { }

  async createDocument(documentEntity: DocumentEntity, metadataType: string, attributes: string[]): Promise<void> {
    await this.documentRepository.create(documentEntity);
}


  async getDocumentById(id: string): Promise<DocumentDTO | null> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      // if (documentEntity.file && documentEntity.file.metadata) {
      //   const metadata = await this.metadataService.getMetadataById(documentEntity.file.metadata._id);
      //   documentEntity.file.metadata = metadata;
      // }
      return {
        // id: documentEntity.id,
        title: documentEntity.title,
        file: {
          fileName: documentEntity.file.fileName,
          fileExtension: documentEntity.file.fileExtension,
          contentType: documentEntity.file.contentType,
          tags: [...documentEntity.file.tags],
          metadata: documentEntity.file.metadata
        },
        author: documentEntity.author,
        // createdAt: documentEntity.createdAt,
        // updatedAt: documentEntity.updatedAt,
      };
    } else {
      return null;
    }
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
