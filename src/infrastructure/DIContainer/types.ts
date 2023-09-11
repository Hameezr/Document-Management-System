const TYPES = {
    DocumentService: Symbol.for("DocumentService"),
    ProcessFileService: Symbol.for("ProcessFileService"),
    DocumentRepository: Symbol.for("DocumentRepository"),
    DocumentController: Symbol.for("DocumentController"),

    UserService: Symbol.for("UserService"),
    UserRepository: Symbol.for("UserRepository"),
    UserController: Symbol.for("UserController"),

    FileService: Symbol.for("IFileService"),
    RuleService: Symbol.for("RuleService"),
    RulesRepository: Symbol.for("RulesRepository"),
    MetadataValidationService: Symbol.for("MetadataValidationService"),
};

export default TYPES;
