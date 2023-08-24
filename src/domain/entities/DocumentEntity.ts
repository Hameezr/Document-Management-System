import { BaseEntity, IEntity } from "./BaseEntity";
import { Result } from "oxide.ts";
import { MetadataSchema } from "./MetadataEntity";
import { DocumentDTO } from "../../application/DTO/DocumentDTO";

export interface IDocument extends IEntity {
    title: string;
    file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    };
    author: string;
}

export class DocumentEntity extends BaseEntity implements IDocument {
    private _title: string;
    private _file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    };
    private _author: string;

    constructor(title: string, file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }, author: string) {
        super();
        this._title = title;
        this._file = file;
        this._author = author;
    }

    static create(title: string, file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }, author: string): Result<DocumentEntity, Error> {
        const document = new DocumentEntity(title, file, author);
        return Result(document);
    }


    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
        this.markUpdated();
    }

    public get file(): {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    } {
        return this._file;
    }

    public get author(): string {
        return this._author;
    }

    static fromDTO(documentDTO: DocumentDTO): DocumentEntity {
        return new DocumentEntity(documentDTO.title, documentDTO.file, documentDTO.author);
    }

    serialize(): IDocument {
        const { id, title, file, author, createdAt, updatedAt } = this;
        return {
            id,
            title,
            file,
            author,
            createdAt,
            updatedAt
        };
    }
}
