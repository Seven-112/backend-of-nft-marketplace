import { Request } from 'express';
import { BaseModel } from 'src/common/model';

export enum UserType {
  basic = 'basic',
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter',
}

interface UserConstructor {
  username?: string;
  password?: string;
  email: string;
  type?: keyof typeof UserType;
}

export class User extends BaseModel {
  username?: string;
  email: string;
  isActive: boolean;
  password?: string;
  type: keyof typeof UserType;

  constructor({ username, email, password, type = 'basic' }: UserConstructor) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
    this.type = type;
  }
}

export interface RequestWithUser extends Request {
  user: User;
}
