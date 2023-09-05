import { UserRepository } from "../../domain/entities/User/UserRepo.interface";
import { UserEntity } from "../../domain/entities/User/UserEntity";
import { PrismaClient } from '@prisma/client';
import { injectable } from "inversify";

const prisma = new PrismaClient();

@injectable()
export class UserRepositoryImpl implements UserRepository {
    async createUser(userEntity: UserEntity): Promise<void> {
        const data: any = {
            id: userEntity.id,
            username: userEntity.username,
            email: userEntity.email,
            password: userEntity.password,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt
        };

        if (userEntity.ownedDocuments.length > 0) {
            data.ownedDocuments = {
                connect: userEntity.ownedDocuments.map(docId => ({ id: docId }))
            };
        }

        await prisma.user.create({ data });
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
