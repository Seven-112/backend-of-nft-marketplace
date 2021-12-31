import { nanoid } from 'nanoid';
import { BaseModel } from 'src/common/model';

export enum WalletType {
  phantom = 'phantom',
  solflare = 'solflare',
}

export class Wallet extends BaseModel {
  userId: string;
  address: string;
  type: string;

  constructor(userId: string, address: string, type: string) {
    super();
    this.userId = userId;
    this.address = address;
    this.type = type;
  }
}
