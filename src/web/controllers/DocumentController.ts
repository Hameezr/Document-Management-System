import { Request, Response } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { AppError, AppResult } from '@carbonteq/hexapp';


export class DocumentController {
  constructor(private documentService: DocumentService) { }

  async createDocument(req: Request, res: Response): Promise<void> {
    const documentDTOResult = await this.documentService.createDocument(req);
    if (documentDTOResult.isOk()) {
      res.status(201).json(documentDTOResult.unwrap().serialize());
    } else {
      const error = documentDTOResult as AppResult<AppError>;
      console.error("Error creating document:", error.unwrapErr().message);
      res.status(500).json({ error: `Failed to create document, ${error.unwrapErr().message}` });
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
    const documentEntityResult = await this.documentService.getDocumentById(req.params.id);
    if (documentEntityResult.isOk()) {
      res.json(documentEntityResult.unwrap().serialize());
    } else {
      const error = documentEntityResult as AppResult<AppError>;
      console.error("Error retrieving document:", error.unwrapErr().message);
      res.status(404).json({ error: "Document not found." });
    }
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    const updatedDocumentDTOResult = await this.documentService.updateDocument(req, req.params.id);
    if (updatedDocumentDTOResult.isOk()) {
      res.status(200).json(updatedDocumentDTOResult.unwrap().serialize());
    } else {
      const error = updatedDocumentDTOResult as AppResult<AppError>;
      console.error("Error updating document:", error.unwrapErr().message);
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
