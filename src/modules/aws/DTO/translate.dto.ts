import { IsNotEmpty, IsString } from 'class-validator';

export class TranslateBodyDTO {
  @IsString()
  targetLanguageCode: string;
  @IsNotEmpty()
  translateData: any;
}
