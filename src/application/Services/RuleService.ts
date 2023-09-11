import { injectable, inject } from "inversify";
import { RulesRepository } from "../../infrastructure/repositories/RulesRepository";
import TYPES from "../../infrastructure/DIContainer/types";

@injectable()
export class RuleService {
  constructor(@inject(TYPES.RulesRepository) private ruleRepository: RulesRepository) {}

  async createRuleForDocumentType(documentType: string, rule: any): Promise<void> {
    return this.ruleRepository.createRuleForDocumentType(documentType, rule);
  }
}
