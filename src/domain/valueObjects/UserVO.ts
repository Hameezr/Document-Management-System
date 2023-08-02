// domain/valueObjects/UserValueObjects.ts

export class UserId {
    private readonly value: number;
  
    constructor(value: number) {
      this.value = value;
    }
  
    // Methods representing UserId value object...
  
    // Example method:
    public getValue(): number {
      return this.value;
    }
  }
  
  export class Username {
    private readonly value: string;
  
    constructor(value: string) {
      this.value = value;
    }
  
    // Methods representing Username value object...
  
    // Example method:
    public getValue(): string {
      return this.value;
    }
  }
  