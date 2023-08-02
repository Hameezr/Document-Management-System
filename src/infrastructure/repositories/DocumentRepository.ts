import { DocumentDTO } from "../../application/DTO/DocumentDTO";

export interface DocumentRepository {
  create(documentDTO: DocumentDTO): Promise<void>;
  findById(id: string): Promise<DocumentDTO | null>;
  // Add other methods for updating and deleting documents.
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
}
