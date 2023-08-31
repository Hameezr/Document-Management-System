import { Container } from "inversify";
import "reflect-metadata";
import { DocumentService } from "../../application/Services/DocumentService";
import { DocRepository } from "../repositories/DocumentRepository";
import TYPES from "./types";

const container = new Container();

container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
container.bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);

export default container;
