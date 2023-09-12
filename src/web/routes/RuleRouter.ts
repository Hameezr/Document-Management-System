import { Router } from "express";
import container from "../../infrastructure/DIContainer";
import { createRuleController } from "../../infrastructure/DIContainer/ControllerFactory";
import { authMiddleware } from "../../infrastructure/Middleware/authMiddleware";

const ruleController = createRuleController(container);
const ruleRouter = Router();

ruleRouter.post('/create-rule', authMiddleware, ruleController.createRuleForDocumentType);

export default ruleRouter;
