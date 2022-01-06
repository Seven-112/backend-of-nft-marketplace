import { Request } from 'express';
import { BaseModel } from 'src/common/model';

export enum UserType {
  basic = 'basic',
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter',
}

export enum UserRoles {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

interface UserConstructor {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  type?: keyof typeof UserType;
  roles?: UserRoles[];
}

export interface UserWallet {
  address: string;
  type: string;
}

export class User extends BaseModel {
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isActive: boolean;
  password?: string;
  type: keyof typeof UserType;
  wallets: UserWallet[];
  roles: UserRoles[];

  constructor({
    username,
    firstName,
    lastName,
    email,
    password,
    type = 'basic',
    roles = [UserRoles.guest],
  }: UserConstructor) {
    super();
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.type = type;
    this.roles = roles;
    this.wallets = [];
  }
}

export interface RequestWithUser extends Request {
  user: User;
}
