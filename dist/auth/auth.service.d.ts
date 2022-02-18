import { Auth } from 'googleapis';
import { UserService } from '../modules/user/user.service';
export declare class AuthService {
    private usersService;
    private readonly oAuthClient;
    constructor(usersService: UserService);
    validateUser(username: string, password: string): Promise<any>;
    getTokenInfo(token: string): Promise<Auth.TokenInfo>;
}
