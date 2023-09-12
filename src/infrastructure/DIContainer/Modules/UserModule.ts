import { ContainerModule } from "inversify";
import { UserService } from "../../../application/Services/UserService";
import { UserRepositoryImpl } from "../../repositories/UserRepository";
import TYPES from "../types";

const UserModule = new ContainerModule((bind) => {
    bind<UserService>(TYPES.UserService).to(UserService);
    bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl);
});

export default UserModule;
