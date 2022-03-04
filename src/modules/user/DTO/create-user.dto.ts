import { IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsOptional()
  @IsString()
  walletAddress: string;
}
