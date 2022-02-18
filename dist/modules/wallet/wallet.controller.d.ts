import { RequestWithUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { AddWalletDTO } from './DTO/addWallet.dto';
import { RemoveWalletDTO } from './DTO/removeWallet.dto';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    private readonly userService;
    constructor(walletService: WalletService, userService: UserService);
    getWallet(address: string): Promise<import("nestjs-dynamoose").Document<Wallet>>;
    addWallet(req: RequestWithUser, body: AddWalletDTO): Promise<import("../user/user.interface").User>;
    removeWallet(body: RemoveWalletDTO): Promise<import("nestjs-dynamoose").Document<import("../user/user.interface").User>>;
}
