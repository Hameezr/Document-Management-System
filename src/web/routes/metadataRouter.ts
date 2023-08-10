import { Router } from "express";
import { InMemoryMetadataSchemaRepository } from "../../infrastructure/repositories/MetadataRepository"; // Replace with the actual path
import { MetadataService } from "../../application/Services/MetadataService"; // Replace with the actual path
import { MetadataSchemaController } from "../../web/controllers/MetadataController"; // Replace with the actual path

const metadataRepository = new InMemoryMetadataSchemaRepository(); // Creating a new instance of MetadataRepository
const metadataService = new MetadataService(metadataRepository); // Passing the instance to MetadataService
const metadataController = new MetadataSchemaController(metadataService); // Passing the instance to MetadataController

const metadataRouter = Router();

metadataRouter.post("/", (req, res) => metadataController.createMetadataSchema(req, res));
metadataRouter.get("/:type", (req, res) => metadataController.getMetadataSchemaByType(req, res));
// metadataRouter.put("/:type", (req, res) => metadataController.updateMetadataSchema(req, res));
// metadataRouter.delete("/:type", (req, res) => metadataController.deleteMetadataSchema(req, res));

export default metadataRouter;
