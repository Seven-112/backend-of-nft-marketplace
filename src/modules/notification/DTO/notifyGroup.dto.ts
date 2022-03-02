import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class NotifyGroupDTO {
  @ArrayNotEmpty()
  userId: string[];
  @IsNotEmpty()
  msg: any;
}
