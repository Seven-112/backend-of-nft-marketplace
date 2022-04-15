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

export class CreateChannelDTO {

  @IsString()
  @ApiProperty()
  to: string;

  @IsString()
  @ApiProperty()
  name: string;
}
