import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Wallet } from './wallet.interface';
import * as crypto from 'crypto';
import { HASH_SECRET, HASH_SECRET_KEY } from 'src/utils/constants';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';

const ALGORITHM = 'aes-256-cbc';
const SECRET = crypto
  .createHash('sha256')
  .update(HASH_SECRET)
  .digest('base64')
  .substring(0, 32);

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet')
    private readonly walletModel: Model<Wallet, Wallet['id']>,
  ) {}

  async create(wallet: Wallet) {
    return this.walletModel.create(wallet);
  }

  async isWalletAddressAvailable(address: string) {
    const wallet = await this.walletModel
      .query('address')
      .eq(address)
      .limit(1)
      .exec();
    return !wallet.count;
  }

  async findByUserId(userId: string) {
    return this.walletModel.query('userId').eq(userId).exec();
  }

  async findById(id: string) {
    return this.walletModel.get(id);
  }

  async findByWalletAddress(address: string) {
    return this.walletModel.query('address').eq(address).limit(1).exec();
  }

  async generateKey() {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
    let encrypted = cipher.update(HASH_SECRET_KEY);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
      iv: iv.toString('hex'),
      key: encrypted.toString('hex'),
    };
  }

  async verifyKey(
    key: string,
    iv: string,
    publicKey: string,
    sign: string,
  ): Promise<boolean> {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      SECRET,
      Buffer.from(iv, 'hex'),
    );

    let decrypted = decipher.update(Buffer.from(key, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const data = decrypted.toString();

    if (data !== HASH_SECRET_KEY) {
      return false;
    }

    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(key),
      bs58.decode(sign),
      bs58.decode(publicKey),
    );

    return isValid;
  }
}
