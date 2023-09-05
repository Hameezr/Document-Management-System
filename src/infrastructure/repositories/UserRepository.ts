import { UserRepository } from "../../domain/entities/User/UserRepo.interface";
import { UserEntity } from "../../domain/entities/User/UserEntity";
import { PrismaClient } from '@prisma/client';
import { injectable } from "inversify";

const prisma = new PrismaClient();

@injectable()
export class UserRepositoryImpl implements UserRepository {
    async createUser(userEntity: UserEntity): Promise<void> {
        await prisma.user.create({
            data: {
                id: userEntity.id,
                username: userEntity.username,
                email: userEntity.email,
                password: userEntity.password,
                ownedDocuments: {
                    set: userEntity.ownedDocuments
                },
                createdAt: userEntity.createdAt,
                updatedAt: userEntity.updatedAt
            }
        });
    }

    async findUserById(id: string): Promise<UserEntity | null> {
        // const user = await prisma.user.findUnique({
        //   where: { id: id }
        // });
        // if (user) {
        //   const userEntity = new UserEntity(user.username, user.email, user.password);
        //   userEntity.setId(user.id);
        //   return userEntity;
        // }
        return null;
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        // const user = await prisma.user.findUnique({
        //   where: { email: email }
        // });
        // if (user) {
        //   const userEntity = new UserEntity(user.username, user.email, user.password);
        //   userEntity.setId(user.id);
        //   return userEntity;
        // }
        return null;
    }

}
