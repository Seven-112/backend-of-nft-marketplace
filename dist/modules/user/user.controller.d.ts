import { AnyDocument } from 'dynamoose/dist/Document';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import { UpdateProfileDTO } from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { User } from './user.interface';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserProfile(request: any): Promise<{
        code: number;
        message: string;
        data: {
            sub: any;
            populate(): Promise<import("nestjs-dynamoose").Document<User>>;
            populate(callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<User>, import("aws-sdk").AWSError>): void;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings): Promise<import("nestjs-dynamoose").Document<User>>;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings, callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<User>, import("aws-sdk").AWSError>): void;
            serialize(nameOrOptions: string | import("nestjs-dynamoose").SerializerOptions): import("nestjs-dynamoose").ObjectType;
            toJSON(): import("nestjs-dynamoose").ObjectType;
            original(): import("nestjs-dynamoose").ObjectType;
            id: string;
            walletAddress?: string;
            email: string;
            username: string;
            job: string;
            personalWebsite: string;
            phoneNumber: string;
            timezone: string;
            avatar: string;
        };
    }>;
    getUserProfileFromCognito(request: Request): Promise<{
        code: number;
        message: string;
        data: Promise<unknown>;
    }>;
    updateProfile(request: AnyDocument, body: UpdateProfileDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<User>;
    }>;
    update(request: any, body: UpdateUserDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<User>;
    }>;
    getUserInformation(body: GetUserInformationDTO): Promise<{
        code: number;
        data: {
            users: import("nestjs-dynamoose").ModelBatchGetDocumentsResponse<import("nestjs-dynamoose").Document<User>>;
        };
    }>;
    getUserById(id: string): Promise<{
        code: number;
        data: import("nestjs-dynamoose").Document<User>;
    }>;
    search(body: SearchUserDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<User>>;
    }>;
    getByWalletAddress(walletAddress: string): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<User>;
    }>;
}
