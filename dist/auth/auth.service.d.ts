import { JwtService } from '@nestjs/jwt';
import { Auth } from 'googleapis';
import { UserService } from '../modules/user/user.service';
import { JwtResponse } from './auth.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly oAuthClient;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    getTokenInfo(token: string): Promise<Auth.TokenInfo>;
    hashEmailAndOtp(email: string, otp: Number): string;
    verifyOtp(otp: string): JwtResponse;
    updatePassword(email: string, password: string): Promise<unknown>;
}
