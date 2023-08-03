import { DocumentDTO } from "../../application/DTO/DocumentDTO";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";

export interface DocumentRepository {
  create(DocumentEntity: DocumentEntity): Promise<void>;
  findById(id: string): Promise<DocumentDTO | null>;
  // update(documentDTO: DocumentDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  private documents: Map<string, DocumentEntity> = new Map();

  async create(documentEntity: DocumentEntity): Promise<void> {
    this.documents.set(documentEntity.id, documentEntity);
  }
  
  async findById(id: string): Promise<DocumentEntity | null> {
    console.log("documents map:", this.documents);
    const document = this.documents.get(id);
    console.log("found document:", document);

    return document ?? null;
  }
    

    // async update(documentDTO: DocumentDTO): Promise<void> {
    //   const existingDocument = this.documents.get(documentDTO.id);
    //   if (!existingDocument) {
    //     throw new Error("Document not found");
    //   }

    //   this.documents.set(documentDTO.id, documentDTO);
    // }

    async delete(id: string): Promise<void> {
      const document = this.documents.get(id);
      if (!document) {
        throw new Error("Document not found");
      }

      this.documents.delete(id);
    }
}
