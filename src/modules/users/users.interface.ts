import { BaseModel } from 'src/common/model';

export class User extends BaseModel {
  username: string;
  email: string;
  isActive: boolean;
  password: string;
}
