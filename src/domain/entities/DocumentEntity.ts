import { BaseEntity, IEntity } from "./BaseEntity";
import { Result } from "oxide.ts";
import { MetadataSchema } from "./MetadataEntity";
import { NewDocumentDto } from "../../application/DTO/DocumentDTO";

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

    private constructor(title: string, file: {
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

    static createFromDTO(newDocumentDto: NewDocumentDto): DocumentEntity {
        const { title, author, file } = newDocumentDto.data; 
        return new DocumentEntity(title, file, author);
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

    public set file(file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }) {
        this._file = file;
    }

    public set author(author: string) {
        this._author = author;
    }

    setId(id: string) {
        this._id = id;
    }

    setCreatedAt(createdAt: Date) {
        this._createdAt = createdAt;
    }

    setUpdatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
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
