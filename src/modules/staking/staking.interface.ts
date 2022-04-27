import { nanoid } from 'nanoid';

export enum EStakingType {
  staking = 'staking',
  unstaking = 'unstaking',
}

export class Staking {
  id: string;
  type: EStakingType;
  amount: number;
  stakedTime: number;
  wallet: string;

  constructor() {
    this.id = nanoid(12);
  }
}
