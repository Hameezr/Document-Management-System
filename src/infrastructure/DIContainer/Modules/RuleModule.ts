import { ContainerModule } from "inversify";
import { IFileService } from "../../../domain/shared/interfaces/IFile";
import { FileUtility } from "../../repositories/utils/File.utils";
import { RuleService } from "../../../application/Services/RuleService";
import { IRulesProvider } from "../../../domain/shared/interfaces/IRulesProvider";
import { RulesRepository } from "../../repositories/RulesRepository";
import { MetadataValidationService } from "../../../domain/services/MetadataValidationService";

import TYPES from "../types";

const RulesModule = new ContainerModule((bind) => {
    bind<IFileService>(TYPES.FileUtility).to(FileUtility);
    bind<RulesRepository>(TYPES.RulesRepository).to(RulesRepository);
    bind<IRulesProvider>(TYPES.RulesProvider).to(RulesRepository);
    bind<RuleService>(TYPES.RuleService).to(RuleService);
    bind<MetadataValidationService>(TYPES.MetadataValidationService).to(MetadataValidationService);
});

export default RulesModule;
