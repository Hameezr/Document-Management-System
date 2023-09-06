import { UserEntity } from "./UserEntity";

export interface UserRepository {
  createUser(user: UserEntity): Promise<void>;
  findUserById(id: string): Promise<UserEntity | null>;
  findUserByEmail(id: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(skip: number, take: number): Promise<{ users: UserEntity[], total: number, currentPage: number, pageSize: number }>;
}
