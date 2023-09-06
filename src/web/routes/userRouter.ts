import { Router } from "express";
import container from "../../infrastructure/DIContainer/DependencyContainer";
import { createUserController } from '../../infrastructure/DIContainer/ControllerFactory';

const userController = createUserController(container);
const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);


export default userRouter;
