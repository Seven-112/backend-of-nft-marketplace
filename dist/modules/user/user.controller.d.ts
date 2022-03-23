import { AnyDocument } from 'dynamoose/dist/Document';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import { UpdateProfileDTO } from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { User } from './user.interface';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserProfile(request: any): Promise<{
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<User>;
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
    test(): Promise<{}>;
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
