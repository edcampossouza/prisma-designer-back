import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserLogin {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
