import { IsString } from "class-validator";

export class SearchUserDTO {
  @IsString()
  address: string;
}
