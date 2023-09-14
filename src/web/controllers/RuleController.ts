import { Request, Response, NextFunction } from "express";
import { RuleService } from "../../application/Services/RuleService";
import { handleResult } from "../utils/results";

export class RuleController {
  private ruleService: RuleService;
  constructor(ruleService: RuleService) {
    this.ruleService = ruleService;
  }

  createRuleForDocumentType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { type, rules } = req.body;

    if (!type || !rules) {
      res.status(400).json({ error: 'Document type and rule are required.' });
      return;
    }

    const ruleCreationResult = await this.ruleService.createRuleForDocumentType(type, rules);
    if (ruleCreationResult.isOk()) {
      handleResult(res, ruleCreationResult, 200);
    } else {
      next(ruleCreationResult);
    }
  }
}
