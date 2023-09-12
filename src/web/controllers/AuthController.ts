import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/Services/AuthService';
import { handleResult } from '../utils/results';

export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService) { this.authService = authService }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: `${!email && !password ? 'Email & Password' : !email ? 'Email' : 'Password'} are required` });
            return;
        }
        const result = await this.authService.login(email, password);
        if (result.isOk()) {
            handleResult(res, result, 200);
        } else {
            next(result)
        }
    }
}
