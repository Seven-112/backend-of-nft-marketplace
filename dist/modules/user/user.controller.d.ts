import { RequestWithUser } from './user.interface';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: RequestWithUser): Promise<import("./user.interface").User>;
}
