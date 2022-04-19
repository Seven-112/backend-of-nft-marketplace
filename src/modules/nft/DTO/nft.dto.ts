import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNftDTO {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  owner: string;

  @IsString()
  @ApiProperty()
  imgLink: string;

  @IsString()
  @ApiProperty()
  metadataPubkey: string;

  @IsString()
  @ApiProperty()
  type: string;
}

export class UpdateNftDTO extends CreateNftDTO {
  @IsString()
  @ApiProperty()
  price?: string;

  @IsString()
  @ApiProperty()
  usdPrice?: string;
}

export class BuyNFTDTO extends UpdateNftDTO {

  @IsString()
  @ApiProperty()
  user: string;
}
