import { Router } from "express";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createUserController } from '../../infrastructure/DIContainer/ControllerFactory';

const userController = createUserController(container);
const userRouter = Router();

userRouter.post('/', userController.createUser);
// Add more routes for login, logout, etc.

export default userRouter;
