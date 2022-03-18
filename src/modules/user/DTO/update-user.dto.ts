import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  walletAddress: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  name: string;
}
