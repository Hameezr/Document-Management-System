import { Request, Response, NextFunction } from "express";
import { RuleService } from "../../application/Services/RuleService";
import AppLogger from "../../infrastructure/logger/logger";

export class RuleController {
  private ruleService: RuleService;
  private logger: AppLogger;

  constructor(ruleService: RuleService, logger: AppLogger) {
    this.ruleService = ruleService;
    this.logger = logger;
  }

  createRuleForDocumentType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { type, rules } = req.body;

    if (!type || !rules) {
      res.status(400).json({ error: 'Document type and rule are required.' });
      return;
    }

    try {
      await this.ruleService.createRuleForDocumentType(type, rules);
      res.status(200).json({ message: 'Rule created successfully.' });
    } catch (error) {
      next(error);
    }
  }
}
