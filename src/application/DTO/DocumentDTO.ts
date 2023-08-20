import { MetadataSchema } from "../../domain/entities/MetadataEntity";

export interface DocumentDTO {
  id: string;
  title: string;
  file: {
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: { key: string; name: string }[];
    metadata: MetadataSchema
  };
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
