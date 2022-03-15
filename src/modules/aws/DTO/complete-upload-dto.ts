import { IsString } from 'class-validator';

export class CompleteUploadDTO {
  @IsString({ each: true })
  etags: string[];
}
