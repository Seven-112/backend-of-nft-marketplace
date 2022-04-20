import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckEmailDTO {
  @IsString()
  @ApiProperty()
  email: string;
}
