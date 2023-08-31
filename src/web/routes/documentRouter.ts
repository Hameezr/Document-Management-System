import { Router } from "express";
import multer from "multer";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createDocumentController } from "../../infrastructure/DIContainer/ControllerFactory";

const documentController = createDocumentController(container);
const documentRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

documentRouter.post("/", upload.single("file"), documentController.createDocument);
documentRouter.get("/:id", documentController.getDocumentById);
documentRouter.get("/", documentController.getAllDocuments);
documentRouter.delete("/:id", documentController.deleteDocument);
documentRouter.put("/:id", upload.single("file"), documentController.updateDocument);

export default documentRouter;
