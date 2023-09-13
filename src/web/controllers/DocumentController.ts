import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import AppLogger from "../../infrastructure/logger/logger";
import { handleResult } from "../utils/results";


export class DocumentController {
  private documentService: DocumentService;
  private logger: AppLogger;

  constructor(documentService: DocumentService, logger: AppLogger) {
    this.documentService = documentService;
    this.logger = logger;
  }

  createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documentDTOResult = await this.documentService.createDocument(req);
    if (documentDTOResult.isOk()) {
      handleResult(res, documentDTOResult, 201, this.logger);
    } else {
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
    } else {
      4
      next(updatedDocumentDTOResult);
    }
  }

  deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteDocumentResult = await this.documentService.deleteDocument(req.params.id);
    if (deleteDocumentResult.isOk()) {
      handleResult(res, deleteDocumentResult, 200, this.logger);
    } else {
      next(deleteDocumentResult);
    }
  }
}
