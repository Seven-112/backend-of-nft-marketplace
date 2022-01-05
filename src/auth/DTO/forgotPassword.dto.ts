import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
