import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class VerifyOtpDTO {
  @IsNotEmpty()
  otp: string;
  token: string;
}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  email: string;
  password: string;
}