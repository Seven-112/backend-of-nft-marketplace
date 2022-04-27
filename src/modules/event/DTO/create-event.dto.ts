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
  @Min(0)
  price: number;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  quantity: number;

  @IsDateString()
  @ApiProperty()
  saleStart: Date;

  @IsDateString()
  @ApiProperty()
  saleEnd: Date;
}

export class UpdateTicketDTO extends TicketDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsNumber()
  @ApiProperty()
  sold: number;
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

export class UpdateEventDTO extends CreateEventDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsDateString()
  @ApiProperty()
  createdAt: Date;

  @ValidateNested()
  @ApiProperty()
  @Type(() => UpdateTicketDTO)
  ticket: UpdateTicketDTO;
}
