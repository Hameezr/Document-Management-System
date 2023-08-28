import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { InMemoryDocumentRepository } from "../../infrastructure/repositories/DocumentRepository";

import multer from "multer";

const documentRepository = new InMemoryDocumentRepository();
const documentService = new DocumentService(documentRepository); 
const documentController = new DocumentController(documentService); // Passing the instance to DocumentController

const documentRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

documentRouter.post("/", upload.single("file"), documentController.createDocument);
documentRouter.get("/:id", documentController.getDocumentById);
documentRouter.get("/",  documentController.getAllDocuments);
documentRouter.delete("/:id", documentController.deleteDocument);
documentRouter.put("/:id", upload.single("file"), documentController.updateDocument);


export default documentRouter;
