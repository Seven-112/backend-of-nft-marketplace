import { AnyDocument } from 'dynamoose/dist/Document';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import { UpdatePasswordDTO, UpdateProfileDTO, UpdateSocialDTO } from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    clear(): Promise<void>;
    getUserProfile(request: any): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
    getUserProfileFromCognito(request: Request): Promise<{
        code: number;
        message: string;
        data: unknown;
    }>;
    updateProfile(request: AnyDocument, body: UpdateProfileDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    updateSocial(request: any, body: UpdateSocialDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: any;
    }>;
    updatePassword(request: AnyDocument, body: UpdatePasswordDTO): Promise<{
        code: any;
        message: any;
    }>;
    update(request: any, body: UpdateUserDTO): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
    updateUser(request: AnyDocument, body: any): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
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
            accounts: any;
            length: any;
        };
        message?: undefined;
    }>;
    getUserInformation(body: GetUserInformationDTO): Promise<{
        code: number;
        data: {
            users: any;
        };
    }>;
    getUserById(id: string): Promise<{
        code: number;
        message: string;
        data: any;
    } | {
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        data: any;
        message?: undefined;
    }>;
    search(body: SearchUserDTO): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    getByWalletAddress(walletAddress: string): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
    delete(id: string): Promise<{
        code: number;
        message: string;
        data: any;
    } | {
        code: number;
        data: any;
        message?: undefined;
    }>;
}
