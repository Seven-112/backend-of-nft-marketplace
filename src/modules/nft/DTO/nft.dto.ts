import { IsString } from 'class-validator';

export class CreateNftDTO {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  owner: string;
}
