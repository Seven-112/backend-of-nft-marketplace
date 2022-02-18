"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const crypto = require("crypto");
const constants_1 = require("../../utils/constants");
const nacl = require("tweetnacl");
const bs58 = require("bs58");
const ALGORITHM = 'aes-256-cbc';
let WalletService = class WalletService {
    constructor(walletModel) {
        this.walletModel = walletModel;
    }
    async create(wallet) {
        return this.walletModel.create(wallet);
    }
    async createTransaction(wallet) {
        return this.walletModel.transaction.create(wallet);
    }
    async isWalletAddressAvailable(address) {
        const wallet = await this.walletModel
            .query('address')
            .eq(address)
            .limit(1)
            .exec();
        return !wallet.count;
    }
    async findByUserId(userId) {
        return this.walletModel.query('userId').eq(userId).exec();
    }
    async findById(id) {
        return this.walletModel.get(id);
    }
    async findByWalletAddress(address) {
        return this.walletModel.query('address').eq(address).limit(1).exec();
    }
    async deleteWallet(id) {
        return this.walletModel.delete(id);
    }
    async deleteWalletTransaction(id) {
        return this.walletModel.transaction.delete(id);
    }
    async generateKey() {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, constants_1.SECRET, iv);
        let encrypted = cipher.update(constants_1.HASH_SECRET_KEY);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: iv.toString('hex'),
            key: encrypted.toString('hex'),
        };
    }
    async verifyKey(key, iv, publicKey, sign) {
        const decipher = crypto.createDecipheriv(ALGORITHM, constants_1.SECRET, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(Buffer.from(key, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const data = decrypted.toString();
        if (data !== constants_1.HASH_SECRET_KEY) {
            return false;
        }
        const isValid = nacl.sign.detached.verify(new TextEncoder().encode(key), bs58.decode(sign), bs58.decode(publicKey));
        return isValid;
    }
};
WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Wallet')),
    __metadata("design:paramtypes", [Object])
], WalletService);
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.service.js.map