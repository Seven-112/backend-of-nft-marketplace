import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  channel: string;
}
