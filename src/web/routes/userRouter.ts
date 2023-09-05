import { Router } from "express";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createUserController } from '../../infrastructure/DIContainer/ControllerFactory';

const userController = createUserController(container);
const userRouter = Router();

userRouter.post('/', userController.createUser);

export default userRouter;
