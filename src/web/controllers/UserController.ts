import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/Services/UserService';
import { handleResult } from '../utils/results';

export class UserController {
    private userService: UserService;
    constructor(userService: UserService) { this.userService = userService }

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userDTOResult = await this.userService.createUser(req.body);
        if (userDTOResult.isOk()) {
            handleResult(res, userDTOResult, 201);
        } else {
            next(userDTOResult);
        }
    }

    getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const email = req.params.email;
        const userResult = await this.userService.getUserByEmail(email);
        if (userResult.isOk()) {
            handleResult(res, userResult, 200);
        } else {
            next(userResult);
        }
    };

    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { skip, take } = req.query;
        const skipNumber = Number(skip) || 0;
        const takeNumber = Number(take) || 10;

        const usersResult = await this.userService.getAllUsers(skipNumber, takeNumber);

        if (usersResult.isOk()) {
            handleResult(res, usersResult, 200);
        } else {
            next(usersResult);
        }
    }

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userResult = await this.userService.getUserById(req.params.id);
        if (userResult.isOk()) {
            handleResult(res, userResult, 200);
        } else {
            next(userResult);
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const updateResult = await this.userService.updateUser(req.params.id, req.body);
        if (updateResult.isOk()) {
            handleResult(res, updateResult, 200);
        } else {
            next(updateResult);
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deleteResult = await this.userService.deleteUser(req.params.id);
        if (deleteResult.isOk()) {
            handleResult(res, deleteResult, 200);
        } else {
            next(deleteResult);
        }
    }
}