import { DocumentDTO } from "../DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async createDocument(documentDTO: DocumentDTO): Promise<void> {
    const documentEntity = DocumentEntity.fromDTO(documentDTO);
    console.log('docServices: ', documentEntity)
    await this.documentRepository.create(documentEntity);
  }

  async getDocumentById(id: string): Promise<DocumentDTO | null> {
    const documentEntity = await this.documentRepository.findById(id);
    if (documentEntity) {
      return {
        id: documentEntity.id,
        title: documentEntity.title,
        file: {
          fileName: documentEntity.file.fileName,
          fileExtension: documentEntity.file.fileExtension,
          contentType: documentEntity.file.contentType,
          tags: [...documentEntity.file.tags],
          metadata: 'tempMetaData'
        },
        author: documentEntity.author,
        createdAt: documentEntity.createdAt,
        updatedAt: documentEntity.updatedAt,
      };
    } else {
      return null;
    }
  
  }


  async updateDocument(documentDTO: DocumentDTO): Promise<void> {
    const existingDocument = await this.documentRepository.findById(documentDTO.id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    
    // const updatedDocumentEntity = new DocumentEntity(
    //   documentDTO.id,
    //   documentDTO.title,
    //   documentDTO.content,
    //   documentDTO.author
    // );

    // Add other fields from DTO to entity as needed
    // await this.documentRepository.update(updatedDocumentEntity);
  }

  async deleteDocument(id: string): Promise<void> {
    const existingDocument = await this.documentRepository.findById(id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }
    
    await this.documentRepository.delete(id);
  }
}

/* 
In the constructor of DocumentService, an instance of DocumentRepository is passed as a parameter.
This is dependency injection, where the DocumentService class relies on the DocumentRepository 
interface but is not tightly coupled to a specific implementation.

In the createDocument method, the documentDTO representing a new document is received as a parameter. 
The DocumentService class would include the business logic for creating a document, such as validation,
generating timestamps, or any other application-specific rules. Once the document is processed and ready
to be saved, the create method of the injected DocumentRepository is called to persist the document data.

In the getDocumentById method, the id of a document is received as a parameter.
The DocumentService class would include the business logic for retrieving a document by its ID,
such as checking permissions or handling edge cases. If the document is found, the findById method
of the injected DocumentRepository is called to retrieve the document data from the underlying
data store. If the document is not found, the method returns null.
*/;