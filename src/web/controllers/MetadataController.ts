import { Request, Response } from "express";
import { MetadataService } from "../../application/Services/MetadataService";

export class MetadataSchemaController {
  constructor(private metadataService: MetadataService) {}

  async createMetadataSchema(req: Request, res: Response): Promise<void> {
    try {
      const { type, attributes } = req.body;
      const schema = await this.metadataService.createSchema(type, attributes);
      res.status(201).json(schema);
    } catch (error) {
      console.error("Error creating metadata schema:", error);
      res.status(500).json({ error: "Failed to create metadata schema." });
    }
  }

  async getMetadataSchemaByType(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type;
      const schema = await this.metadataService.getMetadataSchemaByType(type);
      if (schema) {
        res.json(schema);
      } else {
        res.status(404).json({ error: "Metadata schema not found for the given type." });
      }
    } catch (error) {
      console.error("Error retrieving metadata schema:", error);
      res.status(500).json({ error: "Failed to retrieve metadata schema." });
    }
  }

  async updateMetadataSchema(req: Request, res: Response): Promise<void> {
    try {
      const { type, attributes } = req.body;
      await this.metadataService.updateMetadataSchema(type, attributes);
      res.status(200).json({ message: "Metadata schema updated successfully." });
    } catch (error) {
      console.error("Error updating metadata schema:", error);
      res.status(500).json({ error: "Failed to update metadata schema." });
    }
  }

  async deleteMetadataSchema(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type;
      await this.metadataService.deleteMetadataSchema(type);
      res.status(200).json({ message: "Metadata schema deleted successfully." });
    } catch (error) {
      console.error("Error deleting metadata schema:", error);
      res.status(500).json({ error: "Failed to delete metadata schema." });
    }
  }
}
