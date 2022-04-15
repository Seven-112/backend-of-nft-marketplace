import { Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User, User['id']>);
    isWalletAvailable(address: string): Promise<boolean>;
    isUserAvailable(id: string): Promise<boolean>;
    getUserById(id: string): Promise<import("nestjs-dynamoose").Document<User>>;
    getUserByIdOrWallet(id: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    createUser(data: User): Promise<import("nestjs-dynamoose").Document<User>>;
    getUserByUsername(username: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getByWalletAddress(address: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getByEmail(email: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    updateUser(user: User): Promise<import("nestjs-dynamoose").Document<User>>;
    updateWalletAddress(id: string, body: any): Promise<import("nestjs-dynamoose").Document<User>>;
    getUsers(ids: string[]): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getAllUsers(limit?: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getUserFromCognito(accessToken: string): Promise<unknown>;
    changePassword(data: aws.CognitoIdentityServiceProvider.ChangePasswordRequest): Promise<unknown>;
    searchUsers(address: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getUserByEmail(email: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
}
