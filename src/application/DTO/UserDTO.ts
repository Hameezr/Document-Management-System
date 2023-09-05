import { UserEntity } from "../../domain/entities/User/UserEntity";
import { BaseDto } from '@carbonteq/hexapp';
import { z } from 'zod';

type NewUserData = {
  username: string;
  email: string;
  password: string;
};

export class NewUserDto extends BaseDto {
  private static readonly schema = z.object({
    username: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(8)
  });

  private constructor(readonly data: NewUserData) { super() }

  static create(data: unknown): NewUserDto {
    const res = BaseDto.validate<NewUserData>(NewUserDto.schema, data);
    return new NewUserDto(res.unwrap());
  }  

  public static getSchema() {
    return this.schema;
  }
}

type PublicUser = NewUserData;

export class UserDTO extends BaseDto {
  private constructor(private readonly data: NewUserData) {
    super();
  }

  static from(user: UserEntity): UserDTO {
    return new UserDTO(user);
  }

  serialize(): PublicUser {
    return this.data;
  }
}
