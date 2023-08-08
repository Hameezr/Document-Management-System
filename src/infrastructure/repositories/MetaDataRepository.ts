export interface MetaDataSchema {
    [key: string]: {
        type: string; // Define the data type for each metadata attribute (e.g., "string", "number", "boolean", etc.)
        required: boolean; // Specify if the metadata attribute is required or not
    };
}

export interface MetaDataRepository {
    getMetadataSchema(fileType: string): Promise<MetaDataSchema | undefined>;
    addMetadataSchema(fileType: string, schema: MetaDataSchema): void; // Add the addMetadataSchema method
    // Additional methods for CRUD operations on metadata schemas can be defined here
}

export class InMemoryMetaDataRepository implements MetaDataRepository {
    private metadataSchemas: Map<string, MetaDataSchema> = new Map();

    async getMetadataSchema(fileType: string): Promise<MetaDataSchema | undefined> {
        const metadetaSchema = this.metadataSchemas.get(fileType);
        return metadetaSchema;
    }

    async addMetadataSchema(fileType: string, schema: MetaDataSchema): Promise<void> {
        this.metadataSchemas.set(fileType, schema);
    }

    // Additional methods for CRUD operations on metadata schemas can be implemented here
}
