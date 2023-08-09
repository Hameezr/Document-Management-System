import { DocumentDTO } from "../../application/DTO/DocumentDTO";

export class DocumentEntity {
  private _id: string;
  private _title: string;
  private _file: {
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: { key: string; name: string }[];
  };
  private _author: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    title: string,
    file: {
      fileName: string;
      fileExtension: string;
      contentType: string;
      tags: { key: string; name: string }[];
    },
    author: string
  ) {
    this._id = id;
    this._title = title;
    this._file = file;
    this._author = author;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get file(): {
    [x: string]: any;
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: { key: string; name: string }[];
  } {
    return this._file;
  }

  get author(): string {
    return this._author;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();
  }

  updateFile(file: {
    fileName: string;
    fileExtension: string;
    contentType: string;
    tags: { key: string; name: string }[];
  }): void {
    this._file = file;
    this._updatedAt = new Date();
  }

  // New static method to create DocumentEntity from DocumentDTO
  static fromDTO(documentDTO: DocumentDTO): DocumentEntity {
    return new DocumentEntity(
      documentDTO.id,
      documentDTO.title,
      documentDTO.file,
      documentDTO.author
    );
  }
}
