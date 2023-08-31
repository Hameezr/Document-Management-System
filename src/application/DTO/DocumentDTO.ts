import { IDocument, DocumentEntity } from "../../domain/entities/DocumentEntity";
import { MetadataSchema } from "../../domain/valueObjects/MetadataVO";
import { DocumentType } from "../../domain/shared/type.utils";
import { IEntity } from "../../domain/utils/BaseEntity";
import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

type NewDocumentData = Omit<IDocument, keyof IEntity>;

type SimpleDocumentData = {
  title: string;
  file: {
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags?: { key: string; name: string }[];
    metadata: {
      type: DocumentType;
      attributes: Record<string, string | number | boolean>;
    };
  };
  author: string;
};

export class NewDocumentDto extends BaseDto {
  private static readonly schema = z.object({
    title: z.string().nonempty(),
    file: z.object({
      fileName: z.string().nonempty(),
      fileExtension: z.string().nonempty(),
      contentType: z.string().nonempty(),
      tags: z.array(z.object({
        key: z.string().nonempty(),
        name: z.string().nonempty(),
      })).optional(),
      metadata: z.object({
        type: z.union([
          z.literal("audio"),
          z.literal("video"),
          z.literal("application"),
          z.literal("image"),
        ]),
        attributes: z.record(z.union([z.string(), z.number(), z.boolean()])),
      }),
    }),
    author: z.string().nonempty(),
  });

  private constructor(readonly data: NewDocumentData) { super() }

  static create(data: unknown): DtoValidationResult<NewDocumentDto> {
    const res = BaseDto.validate<SimpleDocumentData>(NewDocumentDto.schema, data);
    return res.map((simpleData) => {
      const transformedData: NewDocumentData = {
        title: simpleData.title,
        file: {
          ...simpleData.file,
          tags: simpleData.file.tags || [],
          metadata: new MetadataSchema(simpleData.file.metadata.type, simpleData.file.metadata.attributes)
        },
        author: simpleData.author
      };      
      return new NewDocumentDto(transformedData);
    });
  }
}

type PublicDocument = NewDocumentData;

export class DocumentDTO extends BaseDto {
  private constructor(private readonly data: NewDocumentData) {
    super();
  }

  static from(document: DocumentEntity): DocumentDTO {
    return new DocumentDTO(document);
  }

  serialize(): PublicDocument {
    return this.data;
  }
}
