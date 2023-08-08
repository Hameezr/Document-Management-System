import { Router } from "express";
import multer from "multer";
import { MetaDataController } from "../controllers/MetaDataController";
import { MetaDataService } from "../../application/Services/MetaDataService";
import { InMemoryMetaDataRepository } from "../../infrastructure/repositories/MetaDataRepository";

const metaDataRouter = Router();

const metaDataRepository = new InMemoryMetaDataRepository(); // Create an instance of MetaDataRepository
const metaDataService = new MetaDataService(metaDataRepository); // Create an instance of MetaDataService
const metaDataController = new MetaDataController(metaDataService); // Create an instance of MetaDataController

// Endpoint for adding a metadata schema
metaDataRouter.post("/", (req, res) => metaDataController.addMetadataSchema(req, res));

// Endpoint for getting a metadata schema by file type
metaDataRouter.get("/:fileType", (req, res) => metaDataController.getMetadataSchema(req, res));

export default metaDataRouter
