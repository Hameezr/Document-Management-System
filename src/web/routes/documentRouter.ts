import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { InMemoryDocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import multer from "multer";

const documentRepository = new InMemoryDocumentRepository(); // Creating a new instance of DocumentRepository
const documentService = new DocumentService(documentRepository); // Passing the instance to DocumentService
const documentController = new DocumentController(documentService); // Passing the instance to DocumentController

const documentRouter = Router();

const upload = multer({ dest: "uploads/" });
documentRouter.post("/", upload.single("file"), (req, res) => documentController.createDocument(req, res));
// documentRouter.post("/", (req, res) => documentController.createDocument(req, res));
// documentRouter.get("/", (req, res) => documentController.getAllDocuments(req, res)); // Route for getting all documents
documentRouter.get("/:id", (req, res) => documentController.getDocumentById(req, res)); // Route for getting document by ID


export default documentRouter;
