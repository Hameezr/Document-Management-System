import { Router } from "express";
import container from "../../infrastructure/DIContainer";
import { authMiddleware } from "../../infrastructure/Middleware/authMiddleware";
import { createUserController } from '../../infrastructure/DIContainer/ControllerFactory';

const userController = createUserController(container);
const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/', authMiddleware, userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.get('/email/:email', userController.getUserByEmail);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
