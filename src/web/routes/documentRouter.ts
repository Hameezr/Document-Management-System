import { Router } from "express";
import multer from "multer";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import TYPES from "../../infrastructure/DIContainer/types";
import { DocumentController } from "../controllers/DocumentController";

const documentController = container.get<DocumentController>(TYPES.DocumentController);

const documentRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

documentRouter.post("/", upload.single("file"), documentController.createDocument);
documentRouter.get("/:id", documentController.getDocumentById);
documentRouter.get("/",  documentController.getAllDocuments);
documentRouter.delete("/:id", documentController.deleteDocument);
documentRouter.put("/:id", upload.single("file"), documentController.updateDocument);

export default documentRouter;
