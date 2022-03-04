import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class NotifyGroupDTO {
  @ArrayNotEmpty()
  @ApiProperty()
  userId: string[];
  @IsString()
  @ApiProperty()
  type: string;
  @IsNotEmpty()
  msg: any;
  @ApiProperty()
  @IsString()
  @ApiProperty()
  sender: string;
}
