import { IsBoolean, IsEmail } from 'class-validator';

export class CheckCanAuthDto {
  @IsBoolean()
  isGoogle: boolean;

  @IsEmail()
  email: string;
}
