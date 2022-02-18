import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser, User } from 'src/modules/user/user.interface';
import { LoginDTO } from './DTO/login.dto';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';
import { ForgotPasswordDTO } from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { ResetPasswordDTO } from './DTO/resetPassword.dto';
import { RedisCacheService } from 'src/modules/redisCache/redisCache.service';
import { LoginGoogleDTO } from './DTO/loginGoogle.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly walletService;
    private readonly mailService;
    private readonly redisCacheService;
    constructor(authService: AuthService, userService: UserService, walletService: WalletService, mailService: MailService, redisCacheService: RedisCacheService);
    register(body: RegisterDTO): Promise<{
        code: HttpStatus;
        message: string;
    }>;
    login(body: LoginDTO): Promise<{
        code: HttpStatus;
        accessToken: any;
    }>;
    loginGoogle(body: LoginGoogleDTO): Promise<void>;
    isAuthenticated(req: RequestWithUser): Promise<User>;
    forgotPassword(body: ForgotPasswordDTO): Promise<void>;
    resetPassword(body: ResetPasswordDTO): Promise<import("nestjs-dynamoose").Document<User>>;
    walletRequest(): Promise<{
        iv: string;
        key: string;
    }>;
    walletVerify(body: WalletVerifyDTO): Promise<void>;
}
