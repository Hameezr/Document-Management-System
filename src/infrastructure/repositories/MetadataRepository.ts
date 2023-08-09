import { MetadataSchema } from "../../domain/entities/MetadataEntity";

export interface MetadataSchemaRepository {
  create(schema: MetadataSchema): Promise<void>;
  getByType(type: "audio" | "video" | "application" | "image"): Promise<MetadataSchema | null>;
  findById(metadataId: string): Promise<MetadataSchema | null>;
  update(schema: MetadataSchema): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryMetadataSchemaRepository implements MetadataSchemaRepository {
  private schemas: MetadataSchema[] = [];  // Mock database table

  async create(schema: MetadataSchema): Promise<void> {
    this.schemas.push(schema);
  }

  async getByType(type: "audio" | "video" | "application" | "image"): Promise<MetadataSchema | null> {
    return this.schemas.find(schema => schema.type === type) || null;
  }

  async findById(metadataId: string): Promise<MetadataSchema | null> {
    const schema = this.schemas.find(schema => schema.id === metadataId);
    console.log('schema: ', schema)
    return schema ?? null;
  }

  async update(schema: MetadataSchema): Promise<void> {
    const index = this.schemas.findIndex(s => s.id === schema.id);
    if (index === -1) {
      throw new Error(`Schema with ID ${schema.id} not found.`);
    }
    this.schemas[index] = schema;
  }

  async delete(id: string): Promise<void> {
    const index = this.schemas.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Schema with ID ${id} not found.`);
    }
    this.schemas.splice(index, 1);
  }
}
