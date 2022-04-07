import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
  IsEmail
} from 'class-validator';
import { File } from '../support.interface';

export class FileDTO {
  
  @IsString()
  @ApiProperty()
  extension: string;

  @IsString()
  @ApiProperty()
  url: string;
}

export class CreateSupportDTO {
  @IsString()
  @ApiProperty()
  subject: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  category: string;

  @IsString()
  @ApiProperty()
  blockchain: string;

  @IsString()
  @ApiProperty()
  transaction_hash: string;

  @IsString()
  @ApiProperty()
  wallet: string;

  @ValidateNested()
  @ApiProperty()
  @Type(() => FileDTO)
  file: FileDTO;
}
