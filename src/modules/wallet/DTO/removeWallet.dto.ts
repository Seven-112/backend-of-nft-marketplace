import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveWalletDTO {
  @IsNotEmpty()
  @IsString()
  walletAddress: string;
}
