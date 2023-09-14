import { ContainerModule } from "inversify";
import { ILogger } from "../../../domain/shared/interfaces/ILogger";
import PinoAppLogger from "../../logger/logger";
import TYPES from "../types";

const LoggerModule = new ContainerModule((bind) => {
    bind<ILogger>(TYPES.Logger).to(PinoAppLogger).inSingletonScope();
});

export default LoggerModule;
