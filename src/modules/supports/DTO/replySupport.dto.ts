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

export class ReplySupportDTO {

  @IsString()
  @ApiProperty()
  content: string;

  @ValidateNested()
  @ApiProperty()
  @Type(() => FileDTO)
  file: FileDTO;
}
