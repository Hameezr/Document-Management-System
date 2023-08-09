export class MetadataSchema {
    private _id: string;
    private _type: "audio" | "video" | "application" | "image";
    private _attributes: string[];
  
    constructor(id: string, type: "audio" | "video" | "application" | "image", attributes: string[]) {
      this._id = id;
      this._type = type;
      this._attributes = attributes;
    }
  
    get id(): string {
      return this._id;
    }
  
    get type(): "audio" | "video" | "application" | "image" {
      return this._type;
    }
  
    get attributes(): string[] {
      return this._attributes;
    }
    
  }
  