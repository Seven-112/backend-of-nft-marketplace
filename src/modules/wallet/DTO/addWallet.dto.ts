import { IsNotEmpty, IsString } from 'class-validator';

export class AddWalletDTO {
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  walletType: string;
}
