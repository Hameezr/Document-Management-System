import { Container } from "inversify";
import "reflect-metadata";

import AuthModule from "./Modules/AuthModule";
import DocumentModule from "./Modules/DocumentModule";
import RulesModule from "./Modules/RuleModule";
import UserModule from "./Modules/UserModule";
import LoggerModule from "./Modules/LoggerModule";

const container = new Container();

container.load(UserModule, DocumentModule, AuthModule, RulesModule, LoggerModule);

export default container;
