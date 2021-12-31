import { IsNotEmpty, IsString } from 'class-validator';

export class WalletVerifyDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  iv: string;

  @IsString()
  @IsNotEmpty()
  sign: string;

  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
