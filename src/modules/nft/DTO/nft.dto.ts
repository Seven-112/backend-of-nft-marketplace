import { IsString } from 'class-validator';

export class CreateNftDTO {
  @IsString()
  title: string;

  @IsString()
  owner: string;

  price?: number;

  usdPrice?: number;
}
