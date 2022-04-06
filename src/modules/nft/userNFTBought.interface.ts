import { nanoid } from 'nanoid';
import { User } from '../user/user.interface';
import { Nft } from './nft.interface';

export class UserNFTBought {
  id: string;
  nft: Nft;
  user: User;
  constructor() {
    this.id = nanoid(12);
  }
}
