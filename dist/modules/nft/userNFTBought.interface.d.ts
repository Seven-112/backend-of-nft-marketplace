import { User } from '../user/user.interface';
import { Nft } from './nft.interface';
export declare class UserNFTBought {
    id: string;
    nft: Nft;
    user: User;
    constructor();
}
