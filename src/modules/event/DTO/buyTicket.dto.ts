import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
} from 'class-validator';

export class BuyTicketDTO {
  
    @IsNumber()
    @ApiProperty()
    number_ticket: number;
  }
