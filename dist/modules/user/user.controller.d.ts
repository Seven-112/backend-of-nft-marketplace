import { AnyDocument } from 'dynamoose/dist/Document';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import { UpdateProfileDTO, UpdateSocialDTO } from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { Social } from './user.interface';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserProfile(request: any): Promise<{
        code: number;
        message: string;
        data: {
            sub: any;
            populate(): Promise<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
            populate(callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<import("./user.interface").User>, import("aws-sdk").AWSError>): void;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings): Promise<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
            populate(settings: import("dynamoose/dist/Populate").PopulateSettings, callback: import("nestjs-dynamoose").CallbackType<import("nestjs-dynamoose").Document<import("./user.interface").User>, import("aws-sdk").AWSError>): void;
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
            role: string;
            status: string;
            createdAt: string;
            social?: Social;
        };
    }>;
    getUserProfileFromCognito(request: Request): Promise<{
        code: number;
        message: string;
        data: unknown;
    }>;
    updateProfile(request: AnyDocument, body: UpdateProfileDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    updateSocial(request: any, body: UpdateSocialDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    update(request: any, body: UpdateUserDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    updateUser(request: AnyDocument, body: any): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    getAllAccounts(request: AnyDocument, limit?: number): Promise<{
        code: number;
        message: string;
        data: any;
    } | {
        code: number;
        data: {
            accounts: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
            length: number;
        };
        message?: undefined;
    }>;
    getUserInformation(body: GetUserInformationDTO): Promise<{
        code: number;
        data: {
            users: import("nestjs-dynamoose").ModelBatchGetDocumentsResponse<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
        };
    }>;
    getUserById(id: string): Promise<{
        code: number;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
        message?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
    search(body: SearchUserDTO): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
    }>;
    getByWalletAddress(walletAddress: string): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
}
