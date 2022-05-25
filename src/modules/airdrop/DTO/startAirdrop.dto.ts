import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
  IsEmail,
  IsArray
} from 'class-validator';
import { User } from '../airdrop.interface';

export class StartAirdropDTO {
  userList: string;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  userCount: number;
}
