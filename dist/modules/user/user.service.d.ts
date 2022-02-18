import { Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User, User['id']>);
    isUsernameAvailable(username: string): Promise<boolean>;
    updateUser(user: User): Promise<import("nestjs-dynamoose").Document<User>>;
    updateUserTransaction(user: User): Promise<import("nestjs-dynamoose").UpdateTransactionInput>;
    updatePassword(id: string, password: string): Promise<import("nestjs-dynamoose").Document<User>>;
    isEmailAvailable(email: string): Promise<boolean>;
    getUserByEmail(email: string): Promise<import("nestjs-dynamoose").Document<User>>;
    create(user: User): Promise<User>;
    findAll(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>>;
    findById(id: string): Promise<import("nestjs-dynamoose").Document<User>>;
    hashPassword(password: string): Promise<string>;
}
