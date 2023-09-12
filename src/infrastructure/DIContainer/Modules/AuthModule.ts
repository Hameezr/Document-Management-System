import { ContainerModule } from "inversify";
import { AuthService } from '../../../application/Services/AuthService';
import TYPES from "../types";

const AuthModule = new ContainerModule((bind) => {
    bind<AuthService>(TYPES.AuthService).to(AuthService);
});

export default AuthModule;