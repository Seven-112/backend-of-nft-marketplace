import { Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User, User['id']>);
    isWalletAvailable(address: string): Promise<boolean>;
    isUserAvailable(id: string): Promise<boolean>;
    getUserById(id: string): Promise<import("nestjs-dynamoose").Document<User>>;
    createUser(data: User): Promise<import("nestjs-dynamoose").Document<User>>;
    getUserByUsername(username: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    getByWalletAddress(address: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    updateUser(user: User): Promise<import("nestjs-dynamoose").Document<User>>;
    getUsers(ids: string[]): Promise<import("nestjs-dynamoose").ModelBatchGetDocumentsResponse<import("nestjs-dynamoose").Document<User>>>;
    test(): Promise<void>;
    searchUsers(address: string): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
}
