import { Request, Response } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { AppError, AppResult } from '@carbonteq/hexapp';


export class DocumentController {
  constructor(private documentService: DocumentService) { }

  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentDTO = await this.documentService.createDocument(req);
      res.status(201).json(documentDTO.serialize());
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
      const updatedDocumentDTO = await this.documentService.updateDocument(req, req.params.id);
      res.status(200).json(updatedDocumentDTO.serialize());
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
