export class MetadataEntity {
    private _data: any;
    constructor(data: any) {
      this._data = data;
    }
  
    get data(): any {
      return this._data;
    }
  }
  