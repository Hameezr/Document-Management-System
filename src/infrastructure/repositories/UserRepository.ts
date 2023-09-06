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
        const user = await prisma.user.findUnique({
            where: { id: id },
            include: { ownedDocuments: true }
        });
        if (user) {
            return prismaUserToEntity(user);
        }
        return null;
    }

    async findAll(skip: number, take: number): Promise<{ users: UserEntity[], total: number, currentPage: number, pageSize: number }> {
        const total = await prisma.user.count();
        const currentPage = Math.floor(skip / take) + 1;
        const pageSize = take;
        const users = await prisma.user.findMany({
            skip,
            take
        });
        const userEntities = users.map(user => prismaUserToEntity(user));
        return {
            total,
            currentPage,
            pageSize,
            users: userEntities
        };
    }
    async update(userEntity: UserEntity): Promise<void> {
        await prisma.user.update({
            where: { id: userEntity.id },
            data: {
                username: userEntity.username,
                email: userEntity.email,
                password: userEntity.password,
                updatedAt: new Date()
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({ where: { id: id } });
    }
}
function prismaUserToEntity(user: any): UserEntity {
    const userEntityResult = UserEntity.create(user.username, user.email, user.password);

    if (userEntityResult.isOk()) {
        const userEntity = userEntityResult.unwrap();
        userEntity.setId(user.id);
        userEntity.setCreatedAt(new Date(user.createdAt));
        userEntity.setUpdatedAt(new Date(user.updatedAt));

        if (user.ownedDocuments) {
            user.ownedDocuments.forEach((docId: string) => {
                userEntity.addOwnedDocument(docId);
            });
        }
        return userEntity;
    } else {
        throw new Error("Failed to create UserEntity from Prisma user");
    }
}