import { Request } from 'express';
import { BaseModel } from 'src/common/model';

export class User extends BaseModel {
  username: string;
  email: string;
  isActive: boolean;
  password: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
