import { Engine, Rule } from 'json-rules-engine';
import { RulesRepository } from '../../infrastructure/repositories/RulesRepository';
import { injectable, inject } from "inversify";
import TYPES from '../../infrastructure/DIContainer/types';

type RuleValue = {
    type: 'number' | 'string'
    min?: number;
    max?: number;
    [key: string]: any;
};

type Condition = {
    fact: string;
    operator: string;
    value: any;
};
@injectable()
export class MetadataValidationService {
    private engine: Engine;
    private rulesManager: RulesRepository;

    constructor(@inject(TYPES.RulesRepository) rulesManager: RulesRepository) {
        this.engine = new Engine();
        this.rulesManager = rulesManager;
    }

    private async loadRules(documentType: string): Promise<void> {
        this.engine = new Engine();

        const rules = await this.rulesManager.getRules();
        // console.log('rules I get ->', rules)
        const ruleData = rules[documentType];
        if (!ruleData) {
            throw new Error(`No rules defined for document type: ${documentType}`);
        }

        // Ensure each rule has an event property
        if (!ruleData.event) {
            ruleData.event = {
                type: 'rule-triggered',
                params: {
                    message: `Rule for ${documentType} triggered`
                }
            };
        }
        const conditions: Condition[] = [];
        // console.log('ruleData', ruleData)
        Object.entries(ruleData).filter(([key]) => key !== 'event').forEach(([key, ruleValue]) => {
            // console.log('value,', ruleValue)
            const value = ruleValue as RuleValue;
            if (value.type === 'number') {
                if (value.min !== undefined) {
                    conditions.push({
                        fact: key,
                        operator: 'greaterThanInclusive',
                        value: value.min
                    });
                }
                if (value.max !== undefined) {
                    conditions.push({
                        fact: key,
                        operator: 'lessThanInclusive',
                        value: value.max
                    });
                }
                if (value.notEmpty) {
                    conditions.push({
                        fact: key,
                        operator: 'notEqual',
                        value: 0
                    });
                    conditions.push({
                        fact: key,
                        operator: 'notEqual',
                        value: null
                    }); 
                }
            } 
            if (value.type === 'string') {
                if (value.notEmpty) {
                    conditions.push({
                        fact: key,
                        operator: 'notEqual',
                        value: ""
                    });
                }
                if (value.enum) {
                    conditions.push({
                        fact: key,
                        operator: 'in',
                        value: value.enum
                    });
                }
            }
        });

        const formattedRule = {
            conditions: {
                all: conditions
            },
            event: ruleData.event
        };
        const rule = new Rule(formattedRule);
        this.engine.addRule(rule);
    }


    async validateDocumentMetadata(documentType: string, metadata: any): Promise<boolean> {
        try {
            await this.loadRules(documentType);
            const results = await this.engine.run(metadata);
            return results.failureEvents.length === 0;
        } catch (error) {
            throw error;
        }
    }
}
