import { Model } from 'nestjs-dynamoose';
import { Wallet } from './wallet.interface';
export declare class WalletService {
    private readonly walletModel;
    constructor(walletModel: Model<Wallet, Wallet['id']>);
    create(wallet: Wallet): Promise<import("nestjs-dynamoose").Document<Wallet>>;
    createTransaction(wallet: Wallet): Promise<import("nestjs-dynamoose").CreateTransactionInput>;
    isWalletAddressAvailable(address: string): Promise<boolean>;
    findByUserId(userId: string): Promise<import("nestjs-dynamoose").QueryResponse<import("nestjs-dynamoose").Document<Wallet>>>;
    findById(id: string): Promise<import("nestjs-dynamoose").Document<Wallet>>;
    findByWalletAddress(address: string): Promise<import("nestjs-dynamoose").QueryResponse<import("nestjs-dynamoose").Document<Wallet>>>;
    deleteWallet(id: string): Promise<void>;
    deleteWalletTransaction(id: string): Promise<import("nestjs-dynamoose").DeleteTransactionInput>;
    generateKey(): Promise<{
        iv: string;
        key: string;
    }>;
    verifyKey(key: string, iv: string, publicKey: string, sign: string): Promise<boolean>;
}
