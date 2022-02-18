import { Request } from 'express';
import { BaseModel } from 'src/common/model';
export declare enum UserType {
    email = "email",
    google = "google",
    facebook = "facebook",
    twitter = "twitter"
}
export declare enum UserRoles {
    guest = "guest",
    user = "user",
    admin = "admin"
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
export declare class User extends BaseModel {
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
    constructor({ username, firstName, lastName, email, password, social, type, roles, }: UserConstructor);
}
export interface RequestWithUser extends Request {
    user: User;
}
export {};
