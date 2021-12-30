import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Match('password')
  passwordConfirm: string;
}
