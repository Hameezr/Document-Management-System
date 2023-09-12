import bcrypt from 'bcrypt';
import { UserRepository } from "../../domain/entities/User/UserRepo.interface";
import jwt from 'jsonwebtoken';
import { injectable, inject } from "inversify";
import TYPES from '../../infrastructure/DIContainer/types';
import { AppResult, AppError } from '@carbonteq/hexapp' 

@injectable()
export class AuthService {
    private userRepository: UserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
      this.userRepository = userRepository;
  }

    async login(email: string, password: string): Promise<AppResult<string>> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            return AppResult.Err(AppError.NotFound('User with given email not found'));
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return AppResult.Err(AppError.NotFound('Invalid Password'));
        }
  
        const token = this.generateToken(user.id);
        return AppResult.Ok(token);
    }

    generateToken(userId: string): string {
        return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    }
}
