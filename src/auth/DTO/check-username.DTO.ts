import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckUsernameDTO {
  @IsString()
  @ApiProperty()
  username: string;
}
