import { DocumentDTO } from "../../application/DTO/DocumentDTO";

export interface DocumentRepository {
  create(documentDTO: DocumentDTO): Promise<void>;
  findById(id: string): Promise<DocumentDTO | null>;
  update(documentDTO: DocumentDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
    private documents: Map<string, DocumentDTO> = new Map();
  
    async create(documentDTO: DocumentDTO): Promise<void> {
      this.documents.set(documentDTO.id, documentDTO);
    }
  
    async findById(id: string): Promise<DocumentDTO | null> {
      const document = this.documents.get(id);
      return document ? { ...document } : null;
    }

    async update(documentDTO: DocumentDTO): Promise<void> {
      const existingDocument = this.documents.get(documentDTO.id);
      if (!existingDocument) {
        throw new Error("Document not found");
      }

      this.documents.set(documentDTO.id, documentDTO);
    }

    async delete(id: string): Promise<void> {
      const document = this.documents.get(id);
      if (!document) {
        throw new Error("Document not found");
      }

      this.documents.delete(id);
    }
}
