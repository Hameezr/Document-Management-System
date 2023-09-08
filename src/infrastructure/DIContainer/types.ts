const TYPES = {
    DocumentService: Symbol.for("DocumentService"),
    ProcessFileService: Symbol.for("ProcessFileService"),
    DocumentRepository: Symbol.for("DocumentRepository"),
    DocumentController: Symbol.for("DocumentController"),

    UserService: Symbol.for("UserService"),
    UserRepository: Symbol.for("UserRepository"),
    UserController: Symbol.for("UserController"),

    FileService: Symbol.for("IFileService"),
    RulesManager: Symbol.for("RulesManager"),
    RulesEngineService: Symbol.for("RulesEngineService"),
};

export default TYPES;
