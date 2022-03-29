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
import { EEventType, ETicketType } from '../event.interface';

export class TicketDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(ETicketType)
  @ApiProperty()
  type: ETicketType;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  price: Number;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  quantity: Number;

  @IsDateString()
  @ApiProperty()
  saleStart: Date;

  @IsDateString()
  @ApiProperty()
  saleEnd: Date;
}

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
  @ApiProperty()
  location: string;

  @IsDateString()
  @ApiProperty()
  publishDate: Date;

  @ValidateNested()
  @ApiProperty()
  @Type(() => TicketDTO)
  ticket: TicketDTO;
}
