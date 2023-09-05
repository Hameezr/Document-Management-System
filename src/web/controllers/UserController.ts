import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/Services/UserService';
import { handleResult } from '../utils/results';
import { logGenericMessage } from '../../infrastructure/logger/logger';

export class UserController {
  private userService: UserService;
  constructor(userService: UserService) { this.userService = userService }

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userDTOResult = await this.userService.createUser(req.body);
    if (userDTOResult.isOk()) {
      logGenericMessage('Controller', 'User Created');
      handleResult(res, userDTOResult, 201);
    } else {
      logGenericMessage('Controller', 'User Create', 'error');
      next(userDTOResult);
    }
  }
}
