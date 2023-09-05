import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import { UserDTO, NewUserDto } from "../DTO/UserDTO";
import { UserRepository } from "../../domain/entities/User/UserRepo.interface";
import { UserEntity } from "../../domain/entities/User/UserEntity";
import { logGenericMessage } from "../../infrastructure/logger/logger";
import TYPES from "../../infrastructure/DIContainer/types";

@injectable()
export class UserService {
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) { }

    async createUser(newUserDto: NewUserDto): Promise<AppResult<UserDTO>> {
        const userEntityResult = UserEntity.create(
            newUserDto.data.username,
            newUserDto.data.email,
            newUserDto.data.password
        );
        if (userEntityResult.isOk()) {
            const userEntity = userEntityResult.unwrap();
            await this.userRepository.createUser(userEntity);
            return AppResult.Ok(UserDTO.from(userEntity));
        } else {
            const error = userEntityResult.unwrapErr();
            return AppResult.Err(AppError.InvalidData(error.message));
        }
    }

    async getUserById(id: string): Promise<AppResult<UserDTO>> {
        const user = await this.userRepository.findUserById(id);
        if (user) {
            logGenericMessage('Service', 'FetchById');
            return AppResult.Ok(UserDTO.from(user));
        }
        logGenericMessage('Service', 'FetchById', 'error');
        return AppResult.Err(AppError.NotFound(`User with ID ${id} not found`));
    }

    // Add more methods for authentication, document ownership, etc.
}
