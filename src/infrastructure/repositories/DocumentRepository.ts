import { DocumentEntity } from "../../domain/entities/Document/DocumentEntity";
import { DocumentRepository } from '../../domain/entities/Document/DocumentRepo.interface'
import { prismaDocumentToEntity } from "./utils/repo.utils";
import { PrismaClient } from '@prisma/client';
import { injectable } from "inversify";

const prisma = new PrismaClient();

@injectable()
export class DocRepository implements DocumentRepository {
  async create(documentEntity: DocumentEntity): Promise<void> {
    await prisma.document.create({
      data: {
        id: documentEntity.id,
        title: documentEntity.title,
        ownerId: documentEntity.ownerId,
        file: {
          create: {
            fileName: documentEntity.file.fileName,
            fileExtension: documentEntity.file.fileExtension,
            contentType: documentEntity.file.contentType,
            tags: documentEntity.file.tags,
            metadata: {
              create: {
                type: documentEntity.file.metadata.type,
                attributes: documentEntity.file.metadata.attributes,
                ...(documentEntity.file.metadata.author ? { author: documentEntity.file.metadata.author } : {})
              }
            }
          }
        },
        createdAt: documentEntity.createdAt,
        updatedAt: documentEntity.updatedAt
      }
    });
  }


  async findAll(skip: number, take: number): Promise<{ documents: DocumentEntity[], total: number, currentPage: number, pageSize: number }> {
    const total = await prisma.document.count();
    const currentPage = Math.floor(skip / take) + 1;
    const pageSize = take;
    const documents = await prisma.document.findMany({
      skip,
      take,
      include: {
        file: {
          include: {
            metadata: true
          }
        }
      }
    });
    const documentEntities = documents.map(doc => prismaDocumentToEntity(doc));
    return {
      total,
      currentPage,
      pageSize,
      documents: documentEntities
    };
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
      return prismaDocumentToEntity(document);
    }
    return null
  }

  async update(documentEntity: DocumentEntity): Promise<void> {
    await prisma.document.update({
      where: { id: documentEntity.id },
      data: {
        title: documentEntity.title,
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
                attributes: documentEntity.file.metadata.attributes,
                ...(documentEntity.file.metadata.author ? { author: documentEntity.file.metadata.author } : {})
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
}
