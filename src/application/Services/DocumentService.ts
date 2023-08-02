import { DocumentDTO } from "../../application/DTO/DocumentDTO";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async createDocument(documentDTO: DocumentDTO): Promise<void> {
    // Add business logic for creating a document
    // and call the repository to save it.
    await this.documentRepository.create(documentDTO);
  }

  async getDocumentById(id: string): Promise<DocumentDTO | null> {
    // Add business logic for retrieving a document by ID
    // and return the document DTO.
    const document = await this.documentRepository.findById(id);
    return document;
    // if the document is not found, return null
  }

  // Add other methods for updating and deleting documents.
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