import { DocumentEntity } from "./DocumentEntity";

export interface DocumentRepository {
    create(documentEntity: DocumentEntity): Promise<void>;
    findById(id: string): Promise<DocumentEntity | null>;
    findAll(skip: number, take: number): Promise<{ documents: DocumentEntity[], total: number, currentPage: number, pageSize: number }>;
    update(documentEntity: DocumentEntity): Promise<void>;
    delete(id: string): Promise<void>;
  }