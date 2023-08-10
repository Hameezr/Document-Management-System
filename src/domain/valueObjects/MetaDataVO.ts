export class MetadataSchema {
    private readonly _type: "audio" | "video" | "application" | "image";
    private readonly _attributes: string[];
  
    constructor(type: "audio" | "video" | "application" | "image", attributes: string[]) {
      this._type = type;
      this._attributes = [...attributes];
    }
  
    get type(): "audio" | "video" | "application" | "image" {
      return this._type;
    }

    get attributes(): string[] {
      return [...this._attributes];
    }

    equals(other: MetadataSchema): boolean {
      return this._type === other._type && this.arraysEqual(this._attributes, other._attributes);
    }

    private arraysEqual(a: string[], b: string[]): boolean {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }
}
// Document Entity modifications below if metadata is a VO
/*
export class DocumentEntity {
    // ... other properties ...

    private _file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema; // Now a value object
    };

    // ... other methods ...

    updateFile(file: {
        fileName: string;
        fileExtension: string;
        contentType: string;
        tags: { key: string; name: string }[];
        metadata: MetadataSchema
    }): void {
        this._file = file;
        this._updatedAt = new Date();
    }
}


*/