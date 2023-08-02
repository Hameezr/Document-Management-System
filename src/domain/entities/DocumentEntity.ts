// domain/entities/document/DocumentEntity.ts

import { DocumentId, DocumentTitle } from "../valueObjects/DocumentVO";

export class DocumentEntity {
  private id: DocumentId;
  private title: DocumentTitle;
  // Other document properties and methods...

  constructor(id: DocumentId, title: DocumentTitle) {
    this.id = id;
    this.title = title;
    // Initialize other properties...
  }

  // Methods representing document entity behavior...

  // Example methods:
  public getId(): DocumentId {
    return this.id;
  }

  public getTitle(): DocumentTitle {
    return this.title;
  }
}
