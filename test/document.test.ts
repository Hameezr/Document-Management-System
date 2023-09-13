import { DocumentController } from "../src/web/controllers/DocumentController";
import { DocumentService } from "../src/application/Services/DocumentService";
import PinoAppLogger from "../src/infrastructure/logger/logger";
import { AppResult } from "@carbonteq/hexapp";
import { DocumentDTO } from "../src/application/DTO/DocumentDTO";


describe('DocumentController Tests', () => {
    let documentController: DocumentController;
    let documentServiceMock: jest.Mocked<DocumentService>;

    beforeEach(() => {
        // Mocking DocumentService
        documentServiceMock = {
            createDocument: jest.fn(),
            getDocumentById: jest.fn(),
            updateDocument: jest.fn(),
            deleteDocument: jest.fn(),
            getAllDocuments: jest.fn(),
        } as unknown as jest.Mocked<DocumentService>;

        const logger = new PinoAppLogger();
        documentController = new DocumentController(documentServiceMock, logger);

    });

    it('createDocument should return 201 on success', async () => {
        // Mocking request and response objects
        const req = { body: {} } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn() as any;

        // Mocking the behavior of createDocument
        
        // const successfulResult: AppResult<DocumentDTO> = AppResult.Ok({ id: 'documentId', /* other properties */ });
        // documentServiceMock.createDocument.mockResolvedValueOnce(successfulResult);

        await documentController.createDocument(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith('documentId');
        expect(next).not.toHaveBeenCalled();
    });
});
