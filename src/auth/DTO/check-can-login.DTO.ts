import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckCanLoginDTO {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  walletAddress: string;
}
