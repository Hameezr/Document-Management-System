import { Container } from "inversify";
import "reflect-metadata";

import AuthModule from "./Modules/AuthModule";
import DocumentModule from "./Modules/DocumentModule";
import RulesModule from "./Modules/RuleModule";
import UserModule from "./Modules/UserModule";

const container = new Container();

container.load(UserModule, DocumentModule, AuthModule, RulesModule);

export default container;
