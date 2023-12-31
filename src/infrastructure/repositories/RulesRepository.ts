import { IFileService } from "../../domain/shared/interfaces/IFile";
import { IRulesProvider } from "../../domain/shared/interfaces/IRulesProvider";
import { injectable, inject } from "inversify";
import TYPES from "../DIContainer/types";

@injectable()
export class RulesRepository implements IRulesProvider {
  private fileService: IFileService;
  private static RULES_FILE_PATH = 'rules.json';

  constructor(@inject(TYPES.FileUtility) fileService: IFileService) {
    this.fileService = fileService;
  }

  async createRuleForDocumentType(documentType: string, rule: any): Promise<void> {
    const existingRules = await this.getRules();
    existingRules[documentType] = rule;
    await this.fileService.writeFile(RulesRepository.RULES_FILE_PATH, JSON.stringify(existingRules, null, 2));
  }

  async getRules(): Promise<Record<string, any>> {
    if (!this.fileService.fileExists(RulesRepository.RULES_FILE_PATH)) {
      return {};
    }
    const rawData = await this.fileService.readFile(RulesRepository.RULES_FILE_PATH);
    const parsedData = JSON.parse(rawData);
    return parsedData;
  }

  async getRuleForDocumentType(documentType: string): Promise<any> {
    const rules = await this.getRules();
    return rules[documentType];
  }
}
