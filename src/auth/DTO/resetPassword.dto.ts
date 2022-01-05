import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
