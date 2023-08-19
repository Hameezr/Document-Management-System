import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import DocumentModel from '../models/DocumentModel';

export interface DocumentRepository {
  create(documentEntity: DocumentEntity): Promise<void>;
  findById(id: string): Promise<DocumentEntity | null>;
  update(documentEntity: DocumentEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  async create(documentEntity: DocumentEntity): Promise<void> {

    const mappedDocument = {
      _id: documentEntity.id,
      title: documentEntity.title,
      file: {
        ...documentEntity.file,
        metadata: {
          type: documentEntity.file.metadata.type,
          attributes: documentEntity.file.metadata.attributes
        }
      },
      author: documentEntity.author,
      createdAt: documentEntity.createdAt,
      updatedAt: documentEntity.updatedAt
    };

    const doc = new DocumentModel(mappedDocument);
    await doc.save();
  }



  async findById(id: string): Promise<DocumentEntity | null> {
    return await DocumentModel.findById(id);
  }

  async update(documentEntity: DocumentEntity): Promise<void> {
    await DocumentModel.findByIdAndUpdate(documentEntity.id, documentEntity);
  }

  async delete(id: string): Promise<void> {
    await DocumentModel.findByIdAndDelete(id);
  }
}
