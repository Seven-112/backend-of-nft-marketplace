import { GetUserInformationDTO } from './DTO/get-user-information';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(request: any): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
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
    test(): Promise<{}>;
    getUserInformation(body: GetUserInformationDTO): Promise<{
        code: number;
        data: {
            users: import("nestjs-dynamoose").ModelBatchGetDocumentsResponse<import("nestjs-dynamoose").Document<import("./user.interface").User>>;
        };
    }>;
    getByWalletAddress(walletAddress: string): Promise<{
        code: number;
        message: string;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("nestjs-dynamoose").Document<import("./user.interface").User>;
    }>;
}
