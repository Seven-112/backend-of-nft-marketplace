import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { EEventType } from '../event.interface';

export class CreateEventDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @ApiProperty()
  endDate: Date;

  @IsEnum(EEventType)
  @ApiProperty({ enum: EEventType })
  type: EEventType;

  @IsString()
  location: string;
}
