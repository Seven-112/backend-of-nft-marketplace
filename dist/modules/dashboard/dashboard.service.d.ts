import { Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User, User['id']>);
    isWalletAvailable(address: string): Promise<boolean>;
    isUserAvailable(id: string): Promise<boolean>;
    getUserById(id: string): Promise<any>;
    getUserByIdOrWallet(id: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    createUser(data: User): Promise<any>;
    getUserByUsername(username: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getByWalletAddress(address: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getByEmail(email: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    updateUser(user: User): Promise<any>;
    updateWalletAddress(id: string, body: any): Promise<any>;
    getUsers(ids: string[]): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getAllUsers(limit?: number): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getUserFromCognito(accessToken: string): Promise<unknown>;
    changePassword(data: aws.CognitoIdentityServiceProvider.ChangePasswordRequest): Promise<unknown>;
    searchUsers(address: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    getUserByEmail(email: string): Promise<import("nestjs-dynamoose").ScanResponse<any>>;
    disableUserCognito(email: string): Promise<void>;
    enableUserCognito(email: string): Promise<void>;
}
