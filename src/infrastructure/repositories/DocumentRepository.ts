import { DocumentEntity } from "../../domain/entities/DocumentEntity";

export interface DocumentRepository {
  create(documentEntity: DocumentEntity): Promise<void>;
  findById(id: string): Promise<DocumentEntity | null>;
  update(documentEntity: DocumentEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  private documents: Map<string, DocumentEntity> = new Map();

  async create(documentEntity: DocumentEntity): Promise<void> {
    this.documents.set(documentEntity.id, documentEntity);
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const document = this.documents.get(id);
    return document ?? null;
  }

  async update(documentEntity: DocumentEntity): Promise<void> {
    const existingDocument = this.documents.get(documentEntity.id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    existingDocument.updateTitle(documentEntity.title);
    if (documentEntity.file) {
      existingDocument.updateFile(documentEntity.file.metadata);
    }

    this.documents.set(existingDocument.id, existingDocument);
  }

  async delete(id: string): Promise<void> {
    const document = this.documents.get(id);
    if (!document) {
      throw new Error("Document not found");
    }

    this.documents.delete(id);
  }

}
