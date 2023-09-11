import { Router } from "express";
import multer from "multer";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createDocumentController } from "../../infrastructure/DIContainer/ControllerFactory";
import { authMiddleware } from "../../infrastructure/Middleware/authMiddleware";

const documentController = createDocumentController(container);
const documentRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

documentRouter.post("/", authMiddleware, upload.single("file"), documentController.createDocument);
documentRouter.get("/:id", authMiddleware, documentController.getDocumentById);
documentRouter.get("/", authMiddleware, documentController.getAllDocuments);
documentRouter.delete("/:id", authMiddleware, documentController.deleteDocument);
documentRouter.put("/:id", authMiddleware, upload.single("file"), documentController.updateDocument);

export default documentRouter;
