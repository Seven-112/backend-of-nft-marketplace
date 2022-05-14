import { Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';
import { RedisService } from '../redis/redis.service';
export declare class UserService {
    private readonly userModel;
    private readonly redisService;
    constructor(userModel: Model<User, User['id']>, redisService: RedisService);
    clear(): Promise<void>;
    isWalletAvailable(address: string): Promise<boolean>;
    isUserAvailable(id: string): Promise<boolean>;
    getUserById(id: string): Promise<any>;
    getUserByIdOrWallet(id: string): Promise<any>;
    getUserByUsername(username: string): Promise<any>;
    getByWalletAddress(address: string): Promise<any>;
    getUserByWalletAddressOrId(key: string): Promise<any>;
    getByEmail(email: string): Promise<any>;
    updateUser(user: User): Promise<import("nestjs-dynamoose").Document<User>>;
    updateWalletAddress(id: string, body: any): Promise<import("nestjs-dynamoose").Document<User>>;
    getUsers(ids: string[]): Promise<any>;
    getAllUsers(limit?: number): Promise<any>;
    getUserFromCognito(accessToken: string): Promise<unknown>;
    changePassword(data: aws.CognitoIdentityServiceProvider.ChangePasswordRequest): Promise<unknown>;
    searchUsers(address: string): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    disableUserCognito(email: string): Promise<void>;
    enableUserCognito(email: string): Promise<void>;
    getDataByTime(startTime: number, endTime: number): Promise<any>;
}
