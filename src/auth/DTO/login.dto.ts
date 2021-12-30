import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  password: string;
}
