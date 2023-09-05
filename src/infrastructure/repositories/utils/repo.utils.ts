import { DocumentEntity } from "../../../domain/entities/Document/DocumentEntity";
import { MetadataSchema } from "../../../domain/valueObjects/MetadataVO";
import { Document as PrismaDocument, File } from '@prisma/client';

type MyJsonPrimitive = string | number | boolean | null;
type MyJsonObject = { [key: string]: MyJsonValue };
type MyJsonArray = MyJsonValue[];
type MyJsonValue = MyJsonPrimitive | MyJsonObject | MyJsonArray;

function parseTags(tags: MyJsonValue): { key: string; name: string; }[] {
    if (Array.isArray(tags)) {
        return tags.filter(tag => typeof tag === "object" && tag !== null && "key" in tag && "name" in tag) as { key: string; name: string; }[];
    }
    return [];
}

export function prismaDocumentToEntity(document: PrismaDocument & { file?: (File & { metadata?: any } | null); }): DocumentEntity {
    if (!document.file) {
        throw new Error("Document does not have associated file data");
    }

    // Convert tags using the parseTags utility method
    const tagsArray = parseTags(JSON.parse(JSON.stringify(document.file.tags)));

    // Using MetadataSchema's creation method to generate the schema instance
    const metadataSchema = MetadataSchema.createFromAttributes(document.file.metadata?.type, document.file.metadata?.attributes, document.file.metadata?.author);

    const fileData = {
        fileName: document.file.fileName,
        fileExtension: document.file.fileExtension,
        contentType: document.file.contentType,
        tags: tagsArray,
        metadata: metadataSchema
    };

    const documentEntity = DocumentEntity.create(document.title, fileData).unwrap();
    documentEntity.setId(document.id);
    documentEntity.setCreatedAt(document.createdAt);
    documentEntity.setUpdatedAt(document.updatedAt);

    return documentEntity;
}