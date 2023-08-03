export class DocumentEntity {
    private _id: string;
    private _title: string;
    private _content: string;
    private _author: string;
    private _createdAt: Date;
    private _updatedAt: Date;
  
    constructor(
      id: string,
      title: string,
      content: string,
      author: string
    ) {
      this._id = id;
      this._title = title;
      this._content = content;
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
  
    get content(): string {
      return this._content;
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
  
    updateContent(content: string): void {
      this._content = content;
      this._updatedAt = new Date();
    }
  }
  