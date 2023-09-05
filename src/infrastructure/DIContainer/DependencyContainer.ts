import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import { ProcessFileService } from "../../application/Services/ProcessFileService";
import { UserService } from '../../application/Services/UserService';
import { UserRepositoryImpl} from '../../infrastructure/repositories/UserRepository';
import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<ProcessFileService>(TYPES.ProcessFileService).to(ProcessFileService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;
