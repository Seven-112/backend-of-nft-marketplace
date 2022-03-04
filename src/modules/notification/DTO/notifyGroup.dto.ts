import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class NotifyGroupDTO {
  @ArrayNotEmpty()
  userId: string[];
  @IsString()
  type: string;
  @IsNotEmpty()
  msg: any;
  sender?: string;
}
