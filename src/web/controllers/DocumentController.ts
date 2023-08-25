import { Request, Response } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocumentDTO, NewDocumentDto } from "../../application/DTO/DocumentDTO";
import { MetadataSchema } from "../../domain/entities/MetadataEntity";
import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { AppError, AppResult } from '@carbonteq/hexapp';

import sharp from 'sharp';
import { parseBuffer } from 'music-metadata';
import pdf from 'pdf-parse';

import { v4 as uuidv4 } from 'uuid';


export class DocumentController {
  constructor(private documentService: DocumentService) { }
  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const newDocumentDto = await this.processFile(req);

      // Convert NewDocumentDto to DocumentEntity
      const documentEntity = DocumentEntity.createFromDTO(newDocumentDto);

      // Convert DocumentEntity to DocumentDTO
      const documentDTO = DocumentDTO.from(documentEntity);

      await this.documentService.createDocument(documentEntity);
      res.status(201).json(documentEntity.serialize());
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: `Failed to create document, ${error}` });
    }
  }

  private async processFile(req: Request): Promise<NewDocumentDto> {
    const { title, tags, author } = req.body;
    const { originalname, mimetype } = req.file || {};
    const tagsArray = JSON.parse(tags);
    const fileType = mimetype?.split("/")[0] || ''; // Extract file type from content type (e.g., "image/png" -> "image")
    let existingDocument
    if (req.params.id) {
      existingDocument = await this.documentService.getDocumentById(req.params.id);
    }
    const existingDocumentData = existingDocument?.serialize();
    const existingMetadata = existingDocumentData?.file.metadata;


    let metadata: MetadataSchema;
    if (req.body.metadata) {
      const parsedMetadata = JSON.parse(req.body.metadata);
      metadata = new MetadataSchema(parsedMetadata.type, parsedMetadata.attributes);
    }
    else if (!req.file && existingMetadata) {
      metadata = existingMetadata;
    } else {
      // Placeholder for dynamically determined attributes
      let dynamicAttributes = {};

      // Image metadata extraction
      if (fileType === 'image') {
        const imageMetadata = await sharp(req.file?.buffer).metadata();
        dynamicAttributes = {
          resolution: `${imageMetadata.width}x${imageMetadata.height}`,
          colorDepth: `${imageMetadata.channels} channels`,
          format: imageMetadata.format
        };
      }
      // Audio metadata extraction
      if (fileType === 'audio' && req.file?.buffer) {
        const audioMetadata = await parseBuffer(req.file?.buffer, 'audio/mpeg');
        dynamicAttributes = {
          duration: audioMetadata.format.duration,
          bitrate: audioMetadata.format.bitrate,
          channels: audioMetadata.format.numberOfChannels
        };
      }

      // PDF metadata extraction
      if (fileType === 'application') {
        // PDF metadata extraction
        if (req.file?.mimetype === 'application/pdf') {
          const data = await pdf(req.file.buffer);
          dynamicAttributes = {
            pages: data.numpages,
            version: data.info.PDFFormatVersion
          };
        }
      }
      const attributesArray = Object.entries(dynamicAttributes).map(
        ([key, value]) => `${key}: ${value}`
      );
      // Finally, creating the MetadataSchema

      metadata = MetadataSchema.createFromAttributes(fileType, attributesArray);
    }

    return NewDocumentDto.create({
      title,
      file: {
        fileName: originalname || '',
        fileExtension: originalname?.split(".").pop() || "",
        contentType: mimetype || '',
        tags: tagsArray,
        metadata
      },
      author
    }).unwrap();
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

  //   async updateDocument(req: Request, res: Response): Promise<void> {
  //     try {
  //       const documentDTO = await this.processFile(req);
  //       await this.documentService.updateDocument(documentDTO);
  //       res.sendStatus(200);
  //     } catch (error) {
  //       console.error("Error updating document:", error);
  //       res.status(500).json({ error: "Failed to update document." });
  //     }
  // }


  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentId: string = req.params.id;
      await this.documentService.deleteDocument(documentId);
      res.sendStatus(200);
    } catch (error) {
      // Handle error and send appropriate response.
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document." });
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