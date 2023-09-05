import { BaseEntity, IEntity } from "../../utils/BaseEntity";
import { Result } from "oxide.ts";
import { MetadataSchema } from "../../valueObjects/MetadataVO";
import { NewDocumentDto } from "../../../application/DTO/DocumentDTO";

export interface IDocument extends IEntity {
    title: string;
    file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    };
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

    private constructor(title: string, file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }) {
        super();
        this._title = title;
        this._file = file;
    }

    static createFromDTO(newDocumentDto: NewDocumentDto): DocumentEntity {
        const { title, file } = newDocumentDto.data;
        return new DocumentEntity(title, file);
    }

    static create(title: string, file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }): Result<DocumentEntity, Error> {
        const document = new DocumentEntity(title, file);
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

    public set file(file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema;
    }) {
        this._file = file;
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
        const { id, title, file, createdAt, updatedAt } = this;
        return {
            id,
            title,
            file,
            createdAt,
            updatedAt
        };
    }
}
