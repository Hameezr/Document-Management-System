import { DocumentEntity } from "../../domain/entities/DocumentEntity";
import { PrismaClient, Document as PrismaDocument, Metadata, File } from '@prisma/client';
import { MetadataSchema } from "../../domain/entities/MetadataEntity";

const prisma = new PrismaClient();

type MyJsonPrimitive = string | number | boolean | null;
type MyJsonObject = { [key: string]: MyJsonValue };
type MyJsonArray = MyJsonValue[];
type MyJsonValue = MyJsonPrimitive | MyJsonObject | MyJsonArray;

export interface DocumentRepository {
  create(documentEntity: DocumentEntity): Promise<void>;
  findById(id: string): Promise<DocumentEntity | null>;
  update(documentEntity: DocumentEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

export class InMemoryDocumentRepository implements DocumentRepository {
  async create(documentEntity: DocumentEntity): Promise<void> {
    await prisma.document.create({
      data: {
        id: documentEntity.id,
        title: documentEntity.title,
        file: {
          create: {
            fileName: documentEntity.file.fileName,
            fileExtension: documentEntity.file.fileExtension,
            contentType: documentEntity.file.contentType,
            tags: documentEntity.file.tags,
            metadata: {
              create: {
                type: documentEntity.file.metadata.type,
                attributes: documentEntity.file.metadata.attributes
              }
            }
          }
        },
        author: documentEntity.author,
        createdAt: documentEntity.createdAt,
        updatedAt: documentEntity.updatedAt
      }
    });
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const document = await prisma.document.findUnique({
      where: { id: id },
      include: {
        file: {
          include: {
            metadata: true
          }
        }
      }
    });
    if (document) {
      return this.prismaDocumentToEntity(document);
    }
    return null;
  }


  async update(documentEntity: DocumentEntity): Promise<void> {
    await prisma.document.update({
      where: { id: documentEntity.id },
      data: {
        title: documentEntity.title,
        author: documentEntity.author,
        updatedAt: new Date(),
        file: {
          update: {
            fileName: documentEntity.file.fileName,
            fileExtension: documentEntity.file.fileExtension,
            contentType: documentEntity.file.contentType,
            tags: documentEntity.file.tags,
            metadata: {
              update: {
                type: documentEntity.file.metadata.type,
                attributes: documentEntity.file.metadata.attributes
              }
            }
          }
        }
      }
    });
  }


  async delete(id: string): Promise<void> {
    await prisma.document.delete({ where: { id: id } });
  }

  private parseTags(tags: MyJsonValue): { key: string; name: string; }[] {
    if (Array.isArray(tags)) {
      return tags.filter(tag => typeof tag === "object" && tag !== null && "key" in tag && "name" in tag) as { key: string; name: string; }[];
    }
    return [];
  }

  private prismaDocumentToEntity(document: PrismaDocument & { file?: (File & { metadata?: any } | null); }): DocumentEntity {
    if (!document.file) {
      throw new Error("Document does not have associated file data");
    }

    // Convert tags using the parseTags utility method
    const tagsArray = this.parseTags(JSON.parse(JSON.stringify(document.file.tags)));

    // Use MetadataSchema's creation method to generate the schema instance
    const metadataSchema = MetadataSchema.createFromAttributes(document.file.metadata?.type, document.file.metadata?.attributes);

    const fileData = {
      fileName: document.file.fileName,
      fileExtension: document.file.fileExtension,
      contentType: document.file.contentType,
      tags: tagsArray,
      metadata: metadataSchema
    };

    return new DocumentEntity(document.title, fileData, document.author);
  }

}
