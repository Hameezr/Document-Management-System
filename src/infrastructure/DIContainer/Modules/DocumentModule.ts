import { ContainerModule } from "inversify";
import { DocumentService } from "../../../application/Services/DocumentService";
import { DocRepository } from "../../repositories/DocumentRepository";
import { ProcessFileService } from "../../../application/Services/ProcessFileService";
import TYPES from "../types";

const DocumentModule = new ContainerModule((bind) => {
    bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
    bind<ProcessFileService>(TYPES.ProcessFileService).to(ProcessFileService);
    bind<DocRepository>(TYPES.DocumentRepository).to(DocRepository);
});

export default DocumentModule;