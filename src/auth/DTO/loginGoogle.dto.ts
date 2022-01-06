import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginGoogleDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
