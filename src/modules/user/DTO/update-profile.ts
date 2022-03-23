import { IsString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  username?: string;

  @IsString()
  job?: string;

  @IsString()
  personalWebsite?: string;

  @IsPhoneNumber('VN')
  @IsString()
  phoneNumber: string;

  @IsString()
  timezone: string;

  @IsString()
  avatar: string;
}
