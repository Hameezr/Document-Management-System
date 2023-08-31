import { DocumentController } from "../../web/controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { Container } from "inversify";
import TYPES from "./types";

export function createDocumentController(container: Container): DocumentController {
  const documentService = container.get<DocumentService>(TYPES.DocumentService);
  // Creating and returning a new instance of DocumentController
  return new DocumentController(documentService);
}
