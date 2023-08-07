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
    console.log("documentRepo", documentEntity)
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

    // Use the update methods to modify the existingDocument
    existingDocument.updateTitle(documentEntity.title);
    // existingDocument.updateFile(documentEntity.file);

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
