// domain/entities/document/DocumentEntity.ts
import { DocumentId } from "../valueObjects/DocumentVO";

export class DocumentEntity {
  private _id: DocumentId;
  private _title: string;
  private _content: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(id: DocumentId, title: string, content: string) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): DocumentId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateContent(content: string): void {
    this._content = content;
    this._updatedAt = new Date();
  }
}
