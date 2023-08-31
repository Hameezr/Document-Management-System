import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import { ProcessFileService } from "../../application/Services/ProcessFileService";
import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<ProcessFileService>(TYPES.ProcessFileService).to(ProcessFileService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);

export default container;
