import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { InMemoryDocumentRepository } from "../../infrastructure/repositories/DocumentRepository";

const documentRepository = new InMemoryDocumentRepository(); // Create a new instance of DocumentRepository
const documentService = new DocumentService(documentRepository); // Pass the instance to DocumentService
const documentController = new DocumentController(documentService); // Pass the instance to DocumentController

const documentRouter = Router();

// documentRouter.get("/", (req, res) => res.send('test'));
documentRouter.post("/", (req, res) => documentController.createDocument(req, res));
documentRouter.get("/:id", (req, res) => documentController.getDocumentById(req, res));

export default documentRouter;

