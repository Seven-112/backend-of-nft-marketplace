import { IsString } from 'class-validator';

export class PresignURLDTO {
  @IsString()
  fileName: string;

  @IsString()
  folder: string;
}
