import { DocumentController } from "../../web/controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { UserController } from "../../web/controllers/UserController";
import { UserService } from "../../application/Services/UserService";
import { Container } from "inversify";
import TYPES from "./types";

// To create Document Controller
export function createDocumentController(container: Container): DocumentController {
  const documentService = container.get<DocumentService>(TYPES.DocumentService);
  // Creating and returning a new instance of DocumentController
  return new DocumentController(documentService);
}

// To create User Controller
export function createUserController(container: Container): UserController {
  const userService = container.get<UserService>(TYPES.UserService);
  return new UserController(userService);
}
