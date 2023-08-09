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

const upload = multer({ dest: "uploads/" });;
documentRouter.post("/document", upload.single("file"), (req, res) => documentController.createDocument(req, res));
documentRouter.post("/audio", upload.single("file"), (req, res) => documentController.createAudio(req, res));
documentRouter.post("/video", upload.single("file"), (req, res) => documentController.createVideo(req, res));
documentRouter.post("/image", upload.single("file"), (req, res) => documentController.createImage(req, res));

documentRouter.get("/:id", (req, res) => documentController.getDocumentById(req, res));


export default documentRouter;
