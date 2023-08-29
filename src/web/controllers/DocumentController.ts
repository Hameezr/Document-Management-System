import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../../application/Services/DocumentService";
import { handleResult } from "../utils/results";
import { injectable, inject} from "inversify";
import TYPES from "../../infrastructure/DIContainer/types";

@injectable()
export class DocumentController {
  constructor(@inject(TYPES.DocumentService) private documentService: DocumentService) { }

  createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documentDTOResult = await this.documentService.createDocument(req);
    if (documentDTOResult.isOk()) {
      handleResult(res, documentDTOResult, 201);
    } else {
      next(documentDTOResult);
    }
  }

  getAllDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const documentsResult = await this.documentService.getAllDocuments();
    if (documentsResult.isOk()) {
      handleResult(res, documentsResult, 200);
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
      next(updatedDocumentDTOResult);
    }
  }

  deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteDocumentResult = await this.documentService.deleteDocument(req.params.id);
    if (deleteDocumentResult.isOk()) {
      handleResult(res, deleteDocumentResult, 200);
    } else {
      next(deleteDocumentResult);
    }
  }
}
