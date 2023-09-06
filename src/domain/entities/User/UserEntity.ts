import { BaseEntity, IEntity } from "../../utils/BaseEntity";
import { Result, Err, Ok } from "oxide.ts";
import { NewUserDto } from "../../../application/DTO/UserDTO";

export interface IUser extends IEntity {
  username: string;
  email: string;
  password: string;
  ownedDocuments: string[];
}

export class UserEntity extends BaseEntity implements IUser {
  private _username: string;
  private _email: string;
  private _password: string;
  private _ownedDocuments: string[];

  private constructor(username: string, email: string, password: string) {
    super();
    this._username = username;
    this._email = email;
    this._password = password;
    this._ownedDocuments = [];
  }

  static createFromDTO(newUserDto: NewUserDto): UserEntity {
    const { username, email, password } = newUserDto.data;
    return new UserEntity(username, email, password);
  }

  static create(username: string, email: string, password: string): Result<UserEntity, Error> {
    if (!username || !email || !password) {
      return Err(new Error("Missing required fields"));
    }
    const user = new UserEntity(username, email, password);
    return Ok(user);
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public get ownedDocuments(): string[] {
    return this._ownedDocuments;
  }

  public set username(username: string) {
    this._username = username;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set password(password: string) {
    this._password = password;
  }

  public addOwnedDocument(documentId: string) {
    this._ownedDocuments.push(documentId);
  }

  setId(id: string) {
    this._id = id;
  }

  setCreatedAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  serialize(): IUser {
    const { id, createdAt, updatedAt, username, email, password, ownedDocuments } = this;
    return {
      id,
      createdAt,
      updatedAt,
      username,
      email,
      password,
      ownedDocuments
    };
  }
}
