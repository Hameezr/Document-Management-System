import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { InMemoryDocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { InMemoryMetadataSchemaRepository } from "../../infrastructure/repositories/MetadataRepository";
import { MetadataService } from "../../application/Services/MetadataService";

import multer from "multer";

const documentRepository = new InMemoryDocumentRepository(); 
const metadataRepository = new InMemoryMetadataSchemaRepository();
const metadataService = new MetadataService(metadataRepository);

const documentService = new DocumentService(documentRepository, metadataService); 
const documentController = new DocumentController(documentService); // Passing the instance to DocumentController

const documentRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

documentRouter.post("/", upload.single("file"), (req, res) => documentController.createDocument(req, res));
documentRouter.get("/:id", (req, res) => documentController.getDocumentById(req, res));
documentRouter.delete("/:id", (req, res) => documentController.deleteDocument(req, res));
// documentRouter.put("/:id", upload.single("file"), (req, res) => documentController.updateDocument(req, res));


export default documentRouter;
