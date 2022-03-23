import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  job?: string;

  @IsString()
  @IsOptional()
  personalWebsite?: string;

  @IsPhoneNumber('VN')
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
