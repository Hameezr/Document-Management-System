// domain/entities/user/UserEntity.ts

import { UserId, Username } from "../valueObjects/UserVO";

export class UserEntity {
  private id: UserId;
  private username: Username;
  // Other user properties and methods...

  constructor(id: UserId, username: Username) {
    this.id = id;
    this.username = username;
    // Initialize other properties...
  }

  // Methods representing user entity behavior...

  // Example methods:
  public getId(): UserId {
    return this.id;
  }

  public getUsername(): Username {
    return this.username;
  }
}
