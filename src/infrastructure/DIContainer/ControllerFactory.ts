import { DocumentController } from "../../web/controllers/DocumentController";
import { DocumentService } from "../../application/Services/DocumentService";
import { UserController } from "../../web/controllers/UserController";
import { UserService } from "../../application/Services/UserService";
import { AuthController } from "../../web/controllers/AuthController";
import { AuthService } from '../../application/Services/AuthService';
import { RuleController } from "../../web/controllers/RuleController";
import { RuleService } from "../../application/Services/RuleService";
import { ILogger } from "../../domain/shared/interfaces/ILogger";

import { Container } from "inversify";
import TYPES from "./types";

// To create Document Controller
export function createDocumentController(container: Container): DocumentController {
  const documentService = container.get<DocumentService>(TYPES.DocumentService);
  const logger = container.get<ILogger>(TYPES.Logger);
  logger.setContext(DocumentController.name);
  return new DocumentController(documentService, logger);
}

// To create User Controller
export function createUserController(container: Container): UserController {
  const userService = container.get<UserService>(TYPES.UserService);
  return new UserController(userService);
}

// To create Metadata Rules Controller
export function createRuleController(container: Container): RuleController {
  const ruleService = container.get<RuleService>(TYPES.RuleService);
  return new RuleController(ruleService);
}

export function createAuthController(container: Container): AuthController {
    const authService = container.get<AuthService>(TYPES.AuthService);
    return new AuthController(authService);
}
