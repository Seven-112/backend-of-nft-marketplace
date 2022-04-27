import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { EStakingType } from '../staking.interface';

export class CreateStakingDTO {

  @IsEnum(EStakingType)
  @ApiProperty()
  type: EStakingType;

  @IsNumber()
  @ApiProperty()
  @Min(0)
  amount: number;

  @IsString()
  @ApiProperty()
  wallet: string;
}