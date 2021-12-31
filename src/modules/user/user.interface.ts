import { Request } from 'express';
import { BaseModel } from 'src/common/model';
import { Wallet } from '../wallet/wallet.interface';

export class User extends BaseModel {
  username: string;
  email: string;
  isActive: boolean;
  password: string;

  constructor(username: string, email: string, password: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

export interface RequestWithUser extends Request {
  user: User;
}
