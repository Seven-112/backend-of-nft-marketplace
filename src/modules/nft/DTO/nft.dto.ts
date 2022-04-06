import { IsString } from 'class-validator';

export class CreateNftDTO {
  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsString()
  owner: string;
}
