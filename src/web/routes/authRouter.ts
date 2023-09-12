import { Router } from "express";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createAuthController } from '../../infrastructure/DIContainer/ControllerFactory';

const authController = createAuthController(container);
const authRouter = Router();

authRouter.post('/login', authController.login);

export default authRouter;
