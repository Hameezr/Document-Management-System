import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { handleResult } from "../utils/results";
import { logGenericMessage } from "../../infrastructure/logger/logger";


export class DocumentController {
  private documentService: DocumentService;
  constructor(documentService: DocumentService) { this.documentService = documentService }

  createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documentDTOResult = await this.documentService.createDocument(req);
    if (documentDTOResult.isOk()) {
      logGenericMessage('Controller', 'Created');
      handleResult(res, documentDTOResult, 201);
    } else {
      logGenericMessage('Controller', 'Create', 'error');
      next(documentDTOResult);
    }
  }

  getAllDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const documentsResult = await this.documentService.getAllDocuments(page);
    if (documentsResult.isOk()) {
      const result = documentsResult.unwrap();
      res.status(200).json(result);
    } else {
      next(documentsResult);
    }
  }


  getDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documentEntityResult = await this.documentService.getDocumentById(req.params.id);
    if (documentEntityResult.isOk()) {
      handleResult(res, documentEntityResult, 200);
    } else {
      next(documentEntityResult);
    }
  }

  updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updatedDocumentDTOResult = await this.documentService.updateDocument(req, req.params.id);
    if (updatedDocumentDTOResult.isOk()) {
      handleResult(res, updatedDocumentDTOResult, 200);
    } else {4
      next(updatedDocumentDTOResult);
    }
  }

  deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteDocumentResult = await this.documentService.deleteDocument(req.params.id);
    if (deleteDocumentResult.isOk()) {
      handleResult(res, deleteDocumentResult, 200, "Document deleted successfully");
    } else {
      next(deleteDocumentResult);
    }
  }
}
