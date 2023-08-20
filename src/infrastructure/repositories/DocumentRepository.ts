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
    const document = await DocumentModel.findById(id);
    if (document) {
      return DocumentEntity.fromDTO(document.toObject()); // Convert mongoose document to DTO and then to Entity
    }
    return null;
    // return await DocumentModel.findById(id);
  }

  async update(documentEntity: DocumentEntity): Promise<void> {
    const mappedDocument = {
      _id: documentEntity.id,
      title: documentEntity.title,
      file: documentEntity.file,
      author: documentEntity.author,
      updatedAt: new Date()
    };

    await DocumentModel.findByIdAndUpdate(documentEntity.id, mappedDocument, { new: true });
  }


  async delete(id: string): Promise<void> {
    await DocumentModel.findByIdAndDelete(id);
  }
}
