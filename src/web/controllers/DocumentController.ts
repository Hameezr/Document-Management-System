import { Request, Response } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { AppError, AppResult } from '@carbonteq/hexapp';


export class DocumentController {
  constructor(private documentService: DocumentService) { }
  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const newDocumentDto = await this.documentService.processFile(req);
      const documentEntity = await this.documentService.createDocument(newDocumentDto);
      res.status(201).json(documentEntity.serialize());
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: `Failed to create document, ${error}` });
    }
  }

  async getAllDocuments(req: Request, res: Response): Promise<void> {
    try {
      const documents = await this.documentService.getAllDocuments();
      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents." });
    }
  }

  async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const documentId: string = req.params.id;
      const documentEntity = await this.documentService.getDocumentById(documentId);
      if (documentEntity) {
        res.json(documentEntity.serialize());
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      // Handle error and send appropriate response.
      console.error("Error retrieving document:", error);
      res.status(500).json({ error: "Failed to retrieve document." });
    }
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentDTO = await this.documentService.processFile(req);
      await this.documentService.updateDocument(documentDTO, req.params.id);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document." });
    }
  }


  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentId: string = req.params.id;
      await this.documentService.deleteDocument(documentId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting document:", error);
      if (error instanceof Error) {
        if (error.message === "Document not found") {
          res.status(404).json({ error: "Document not found." });
        } else {
          res.status(500).json({ error: "Failed to delete document." });
        }
      } else {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  }
}



/*In this implementation, the DocumentController receives a DocumentService
instance through its constructor, allowing it to access the business logic of creating,
retrieving, updating, and deleting documents. The createDocument, getDocumentById,
updateDocument, and deleteDocument methods handle the respective HTTP endpoints and
use the DocumentService to interact with the domain layer and the DocumentEntity to
perform the necessary operations on documents. Error handling is included to handle
any potential issues during these operations and return appropriate responses.

DocumentController Class:
The DocumentController class is defined as an export to be used in other parts of the application.
It has a constructor that takes a single parameter documentService, which is of type DocumentService.
This constructor is responsible for injecting the DocumentService instance into the controller,
following the Dependency Injection principle.

createDocument Method:
The createDocument method is an asynchronous function that handles the HTTP POST request 
for creating a new document.
It takes req (the request object) and res (the response object) as parameters.
Inside the method, the request data is parsed into a DocumentDTO object by accessing the
request body (req.body), where the data is expected to be in JSON format.
The createDocument method of the injected DocumentService is called with the parsed DocumentDTO
as an argument to create the document in the system.
After the document is successfully created, the server responds with an HTTP status code 201 (Created).

getDocumentById Method:
The getDocumentById method is an asynchronous function that handles the HTTP GET request
for retrieving a document by its ID.
It takes req (the request object) and res (the response object) as parameters.
The document ID is extracted from the request parameters (req.params.id).
The getDocumentById method of the injected DocumentService is called with the document ID as 
an argument to retrieve the document from the system.
If the document is found, the server responds with the JSON representation of the document.
If the document is not found, the server responds with an HTTP status code 404 (Not Found).
Other Methods:

The comment suggests that other methods for updating and deleting documents can be added to 
the DocumentController class as well, but they are not provided in the given code snippet.
Overall, the DocumentController class acts as the interface between the HTTP requests and the 
DocumentService. It handles incoming requests, processes the data, and delegates the actual 
business logic to the DocumentService, which is responsible for interacting with the domain 
and repository layers to perform CRUD operations on documents.
*/