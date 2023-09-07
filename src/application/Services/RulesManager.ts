import fs from 'fs';
import path from 'path';

const RULES_FILE_PATH = path.join(__dirname, 'rules.json');

export class RulesManager {
  static async createRuleForDocumentType(documentType: string, rule: any): Promise<void> {
    const existingRules = await this.getRules();
    existingRules[documentType] = rule;
    fs.writeFileSync(RULES_FILE_PATH, JSON.stringify(existingRules, null, 2));
  }

  static async getRules(): Promise<Record<string, any>> {
    if (!fs.existsSync(RULES_FILE_PATH)) {
      return {};
    }
    const rawData = fs.readFileSync(RULES_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  }

  static async getRuleForDocumentType(documentType: string): Promise<any> {
    const rules = await this.getRules();
    return rules[documentType];
  }
}
