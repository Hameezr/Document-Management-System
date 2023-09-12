import { AppError, AppResult } from '@carbonteq/hexapp';
import { injectable, inject } from "inversify";
import { UserDTO, NewUserDto } from "../DTO/UserDTO";
import { UserRepository } from "../../domain/entities/User/UserRepo.interface";
import { UserEntity } from "../../domain/entities/User/UserEntity";
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

    async getUserByEmail(email: string): Promise<AppResult<UserDTO>> {
        const user = await this.userRepository.findUserByEmail(email);
        if (user) {
            return AppResult.Ok(UserDTO.from(user));
        }
        return AppResult.Err(AppError.NotFound(`User with email ${email} not found`));
    }

    async getAllUsers(skip: number, take: number): Promise<AppResult<{ users: UserEntity[], total: number, currentPage: number, pageSize: number }>> {
        const result = await this.userRepository.findAll(skip, take);
        const usersArray = result.users;
        if (usersArray.length > 0) {
            return AppResult.Ok(result);
        }
        return AppResult.Err(AppError.NotFound("No users found"));
    }

    async getUserById(id: string): Promise<AppResult<UserDTO>> {
        const user = await this.userRepository.findUserById(id);
        if (user) {
            return AppResult.Ok(UserDTO.from(user));
        }
        return AppResult.Err(AppError.NotFound(`User with ID ${id} not found`));
    }

    async updateUser(id: string, updateUserDto: NewUserDto): Promise<AppResult<UserDTO>> {
        const existingUser = await this.userRepository.findUserById(id);
        if (!existingUser) {
            return AppResult.Err(AppError.NotFound(`User with ID ${id} not found`));
        }

        const updatedUserEntity = UserEntity.createFromDTO(updateUserDto);
        existingUser.username = updatedUserEntity.username;
        existingUser.email = updatedUserEntity.email;
        existingUser.password = updatedUserEntity.password;
        existingUser.setUpdatedAt(new Date());

        await this.userRepository.update(existingUser);
        return AppResult.Ok(UserDTO.from(existingUser));
    }


    async deleteUser(id: string): Promise<AppResult<void>> {
        const existingUser = await this.userRepository.findUserById(id);
        if (!existingUser) {
            return AppResult.Err(AppError.NotFound(`User with ID ${id} not found`));
        }
        await this.userRepository.delete(id);
        return AppResult.Ok(undefined); // AppResult requires an argument even if it is void, hence passing undefined
    }
}