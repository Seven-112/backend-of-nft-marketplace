import { Request } from 'express';
import { BaseModel } from 'src/common/model';

export enum UserType {
  email = 'email',
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
  social?: Social;
  type?: keyof typeof UserType;
  roles?: UserRoles[];
}

export interface UserWallet {
  address: string;
  type: string;
}

export interface Social {
  facebookId?: string;
  googleId?: string;
  twitterId?: string;
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
  social: Social;

  constructor({
    username,
    firstName,
    lastName,
    email,
    password,
    social,
    type = UserType.email,
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
    this.social = social;
  }
}

export interface RequestWithUser extends Request {
  user: User;
}
