import { IFileService } from "../../domain/shared/interfaces/IFile";
import { injectable, inject } from "inversify";
import TYPES from "../../infrastructure/DIContainer/types";

@injectable()
export class RulesManager {
  private fileService: IFileService;
  private static RULES_FILE_PATH = 'rules.json';

  constructor(@inject(TYPES.FileService) fileService: IFileService) {
    this.fileService = fileService;
  }

  async createRuleForDocumentType(documentType: string, rule: any): Promise<void> {
    const existingRules = await this.getRules();
    // console.log('existingRules-<>', existingRules)
    existingRules[documentType] = rule;
    await this.fileService.writeFile(RulesManager.RULES_FILE_PATH, JSON.stringify(existingRules, null, 2));
  }

  async getRules(): Promise<Record<string, any>> {
    if (!this.fileService.fileExists(RulesManager.RULES_FILE_PATH)) {
      return {};
    }
    const rawData = await this.fileService.readFile(RulesManager.RULES_FILE_PATH);
    const parsedData = JSON.parse(rawData);
    // console.log("Fetched rules from file:", parsedData);
    return parsedData;
  }

  async getRuleForDocumentType(documentType: string): Promise<any> {
    const rules = await this.getRules();
    return rules[documentType];
  }
}
