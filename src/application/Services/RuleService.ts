import { injectable, inject } from "inversify";
import { AppResult, AppError } from '@carbonteq/hexapp';
import { RulesRepository } from "../../infrastructure/repositories/RulesRepository";
import TYPES from "../../infrastructure/DIContainer/types";

@injectable()
export class RuleService {
  constructor(@inject(TYPES.RulesRepository) private ruleRepository: RulesRepository) {}

  async createRuleForDocumentType(documentType: string, rule: any): Promise<AppResult<void>> {
    try {
      await this.ruleRepository.createRuleForDocumentType(documentType, rule);
      return AppResult.Ok(undefined);
    } catch (error) {
      return AppResult.Err(AppError.InvalidData((error as Error).message));
    }
  }
}
