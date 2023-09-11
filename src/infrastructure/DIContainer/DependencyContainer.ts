import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import { ProcessFileService } from "../../application/Services/ProcessFileService";

import { UserService } from '../../application/Services/UserService';
import { UserRepositoryImpl} from '../../infrastructure/repositories/UserRepository';

import { IFileService } from "../../domain/shared/interfaces/IFile";
import { FileService } from "../../application/Services/FileService";
import { RulesRepository } from "../repositories/RulesRepository";
import { MetadataValidationService } from "../../domain/services/MetadataValidationService";

import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<ProcessFileService>(TYPES.ProcessFileService).to(ProcessFileService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl);

container.bind<IFileService>(TYPES.FileService).to(FileService);
container.bind<RulesRepository>(TYPES.RulesRepository).to(RulesRepository);
container.bind<MetadataValidationService>(TYPES.MetadataValidationService).to(MetadataValidationService);

export default container;
