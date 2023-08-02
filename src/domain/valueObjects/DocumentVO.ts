// domain/valueObjects/DocumentValueObjects.ts

export class DocumentId {
    private readonly value: string;
  
    constructor(value: string) {
      this.value = value;
    }
  
    // Methods representing DocumentId value object...
  
    // Example method:
    public getValue(): string {
      return this.value;
    }
  }
  
  export class DocumentTitle {
    private readonly value: string;
  
    constructor(value: string) {
      this.value = value;
    }
  
    // Methods representing DocumentTitle value object...
  
    // Example method:
    public getValue(): string {
      return this.value;
    }
  }
  