import { IsString } from 'class-validator';

export class GetUserInformationDTO {
  @IsString({ each: true })
  userIds: string[];
}
