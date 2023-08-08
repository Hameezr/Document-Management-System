import { MetaDataSchema, MetaDataRepository } from "../../infrastructure/repositories/MetaDataRepository";

export class MetaDataService {
  constructor(private metaDataRepository: MetaDataRepository) {}

  async addMetadataSchema(fileType: string, schema: MetaDataSchema): Promise<void> {
    this.metaDataRepository.addMetadataSchema(fileType, schema);
  }

  async getMetadataSchema(fileType: string): Promise<MetaDataSchema | undefined> {
    return this.metaDataRepository.getMetadataSchema(fileType);
  }

  async processMetadata(fileType: string, metadata: any): Promise<any> {
    const schema = await this.getMetadataSchema(fileType); // Use await to get the actual MetaDataSchema object
    if (!schema) {
      throw new Error(`Metadata schema not found for file type: ${fileType}`);
    }

    // Validate and process the provided metadata based on the schema
    const processedMetadata: any = {};
    for (const key in schema) {
      const attribute = schema[key];
      if (metadata.hasOwnProperty(key)) {
        // Check if the attribute is required and the value is not empty
        if (attribute.required && !metadata[key]) {
          throw new Error(`Metadata attribute "${key}" is required.`);
        }

        // Check the data type of the value
        if (typeof metadata[key] !== attribute.type) {
          throw new Error(`Invalid data type for metadata attribute "${key}". Expected "${attribute.type}".`);
        }

        processedMetadata[key] = metadata[key];
      } else {
        // Check if the attribute is required and the value is missing
        if (attribute.required) {
          throw new Error(`Metadata attribute "${key}" is required.`);
        }
      }
    }
    return processedMetadata;
  }
}
