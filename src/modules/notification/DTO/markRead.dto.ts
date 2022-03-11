import { IsString } from 'class-validator';

export class MarkReadDTO {
  @IsString({ each: true })
  messageIds: string[];
}
