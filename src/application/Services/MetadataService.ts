import { MetadataSchema } from "../../domain/entities/MetadataEntity";
import { MetadataSchemaRepository } from "../../infrastructure/repositories/MetadataRepository";
import { v4 as uuidv4 } from 'uuid';

export class MetadataService {
  constructor(private metadataSchemaRepository: MetadataSchemaRepository) {}

  async createSchema(type: string, attributes: string[]): Promise<MetadataSchema> {
    const schema = new MetadataSchema(uuidv4(), type as "audio" | "video" | "application" | "image", attributes);
    await this.metadataSchemaRepository.create(schema);
    return schema;
  }

  async getMetadataSchemaByType(type: string): Promise<MetadataSchema | null> {
    return await this.metadataSchemaRepository.getByType(type as "audio" | "video" | "application" | "image");
  }

  async getMetadataById(metadataId: string): Promise<MetadataSchema | null> {
    return await this.metadataSchemaRepository.findById(metadataId);
  }

  async updateMetadataSchema(type: string, attributes: string[]): Promise<void> {
    const existingSchema = await this.getMetadataSchemaByType(type);
    if (existingSchema) {
        const updatedSchema = new MetadataSchema(existingSchema.id, type as "audio" | "video" | "application" | "image", attributes);
        await this.metadataSchemaRepository.update(updatedSchema);
    } else {
        throw new Error(`MetadataSchema for type: ${type} not found.`);
    }
}

  async deleteMetadataSchema(type: string): Promise<void> {
    const schema = await this.getMetadataSchemaByType(type);
    if (schema) {
      await this.metadataSchemaRepository.delete(schema.id);
    } else {
      throw new Error(`MetadataSchema for type: ${type} not found.`);
    }
  }
}
