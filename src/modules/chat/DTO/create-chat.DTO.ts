import { IsString } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  userId: string;

  @IsString()
  channel: string;
}
