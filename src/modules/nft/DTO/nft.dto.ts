import { IsString } from 'class-validator';

export class CreateNftDTO {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  owner: string;

  @IsString()
  imgLink: string;

  @IsString()
  metadataPubkey: string;

  @IsString()
  type: string;
}

export class UpdateNftDTO extends CreateNftDTO {
  price?: string;
  usdPrice?: string;
}
