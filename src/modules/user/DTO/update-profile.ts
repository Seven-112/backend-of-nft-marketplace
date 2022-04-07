import { Type } from 'class-transformer';
import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class SocialDTO {
  @IsString()
  @IsOptional()
  youtube?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  discord?: string;

  @IsString()
  @IsOptional()
  telegram?: string;
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialDTO)
  social?: SocialDTO;
}

export class UpdateSocialDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialDTO)
  social?: SocialDTO;
}

export class UpdatePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
