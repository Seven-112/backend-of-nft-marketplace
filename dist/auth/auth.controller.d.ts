import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { LoginDTO } from './DTO/login.dto';
import { ForgotPasswordDTO, VerifyOtpDTO, UpdatePasswordDTO } from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { CheckCanLoginDTO } from './DTO/check-can-login.DTO';
import { CheckUsernameDTO } from './DTO/check-username.DTO';
import { CheckEmailDTO } from './DTO/check-email.DTO';
import { CheckCanAuthDto } from './DTO/check-can-auth.DTO';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly mailService;
    private readonly redisService;
    constructor(authService: AuthService, userService: UserService, mailService: MailService, redisService: RedisService);
    checkCanAuth(dto: CheckCanAuthDto): Promise<{
        code: number;
        message: string;
    }>;
    canLogin(body: CheckCanLoginDTO, type?: string): Promise<{
        code: number;
        message: string;
    }>;
    checkUsername(body: CheckUsernameDTO): Promise<{
        code: number;
        message: string;
    }>;
    checkEmail(body: CheckEmailDTO): Promise<{
        code: number;
        message: string;
    }>;
    register(body: RegisterDTO): Promise<{
        code: HttpStatus;
        message: string;
    }>;
    login(body: LoginDTO): Promise<{
        code: HttpStatus;
        accessToken: any;
    }>;
    forgotPassword(body: ForgotPasswordDTO): Promise<{
        token: string;
    }>;
    verifyOtp(body: VerifyOtpDTO): Promise<void>;
    updatePassword(body: UpdatePasswordDTO): Promise<unknown>;
}
