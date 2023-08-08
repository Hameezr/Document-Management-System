import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { MetaDataService } from "../../application/Services/MetaDataService";
import { InMemoryDocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { InMemoryMetaDataRepository } from "../../infrastructure/repositories/MetaDataRepository";
import multer from "multer";

const metaDataRepository = new InMemoryMetaDataRepository();
const documentRepository = new InMemoryDocumentRepository(); // Creating a new instance of DocumentRepository
const documentService = new DocumentService(documentRepository); // Passing the instance to DocumentService
const metaDataService = new MetaDataService(metaDataRepository);
const documentController = new DocumentController(documentService, metaDataService); // Passing the instance to DocumentController

const documentRouter = Router();

const upload = multer({ dest: "uploads/" });;
documentRouter.post("/document", upload.single("file"), (req, res) => documentController.createDocument(req, res));
documentRouter.post("/audio", upload.single("file"), (req, res) => documentController.createAudio(req, res));
documentRouter.post("/video", upload.single("file"), (req, res) => documentController.createVideo(req, res));
documentRouter.post("/image", upload.single("file"), (req, res) => documentController.createImage(req, res));

documentRouter.get("/:id", (req, res) => documentController.getDocumentById(req, res));


export default documentRouter;
