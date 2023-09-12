import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import { ProcessFileService } from "../../application/Services/ProcessFileService";

import { AuthService } from '../../application/Services/AuthService';
import { UserService } from '../../application/Services/UserService';
import { UserRepositoryImpl} from '../../infrastructure/repositories/UserRepository';

import { IFileService } from "../../domain/shared/interfaces/IFile";
import { FileUtility } from "../repositories/utils/File.utils";
import { RuleService } from "../../application/Services/RuleService";
import { IRulesProvider } from "../../domain/shared/interfaces/IRulesProvider";
import { RulesRepository } from "../repositories/RulesRepository";
import { MetadataValidationService } from "../../domain/services/MetadataValidationService";

import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<ProcessFileService>(TYPES.ProcessFileService).to(ProcessFileService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl);

container.bind<IFileService>(TYPES.FileUtility).to(FileUtility);
container.bind<RulesRepository>(TYPES.RulesRepository).to(RulesRepository);
container.bind<IRulesProvider>(TYPES.RulesProvider).to(RulesRepository);
container.bind<RuleService>(TYPES.RuleService).to(RuleService);
container.bind<MetadataValidationService>(TYPES.MetadataValidationService).to(MetadataValidationService);

export default container;
