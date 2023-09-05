import { UserEntity } from "./UserEntity";

export interface UserRepository {
  createUser(user: UserEntity): Promise<void>;
  findUserById(id: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
