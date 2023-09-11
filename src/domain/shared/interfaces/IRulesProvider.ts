export interface IRulesProvider {
    getRules(): Promise<Record<string, any>>;
    getRuleForDocumentType(documentType: string): Promise<any>;
}
