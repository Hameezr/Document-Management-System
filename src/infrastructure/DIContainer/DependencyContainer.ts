import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import { DocumentController } from "../../web/controllers/DocumentController";
import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);
container.bind<DocumentController>(TYPES.DocumentController).to(DocumentController);

export default container;
