import { Request, Response } from "express";
import { MetaDataService } from "../../application/Services/MetaDataService";

export class MetaDataController {
  constructor(private metaDataService: MetaDataService) {}

  addMetadataSchema(req: Request, res: Response): void {
    try {
      const { fileType, schema } = req.body;
      this.metaDataService.addMetadataSchema(fileType, schema);
      res.status(201).json({fileType, schema});
    } catch (error) {
      console.error("Error adding metadata schema:", error);
      res.status(500).json({ error: "Failed to add metadata schema." });
    }
  }

  async getMetadataSchema(req: Request, res: Response): Promise<void> {
    try {
      const { fileType } = req.params;
      const schema = await this.metaDataService.getMetadataSchema(fileType);
      if (schema) {
        res.json(schema);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error retrieving metadata schema:", error);
      res.status(500).json({ error: "Failed to retrieve metadata schema." });
    }
  }
}
