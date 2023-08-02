import { Request, Response } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocumentDTO } from "../../application/DTO/DocumentDTO";

export class DocumentController {
  constructor(private documentService: DocumentService) {}

  async createDocument(req: Request, res: Response): Promise<void> {
    // Parse the request data and create a DocumentDTO.
    const documentDTO: DocumentDTO = req.body;
    await this.documentService.createDocument(documentDTO);
    res.sendStatus(201);
  }

  async getDocumentById(req: Request, res: Response): Promise<void> {
    const documentId: string = req.params.id;
    const document = await this.documentService.getDocumentById(documentId);
    if (document) {
      res.json(document);
    } else {
      res.sendStatus(404);
    }
  }

  // Add other methods for updating and deleting documents.
}

/*
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