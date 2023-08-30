import { DocumentEntity } from "./DocumentEntity";

export interface DocumentRepository {
    create(documentEntity: DocumentEntity): Promise<void>;
    findById(id: string): Promise<DocumentEntity | null>;
    findAll(): Promise<DocumentEntity[]>;
    update(documentEntity: DocumentEntity): Promise<void>;
    delete(id: string): Promise<void>;
  }