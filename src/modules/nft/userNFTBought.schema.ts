import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';
import { Nft } from './nft.schema';

export const UserNFTBoughtSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  user: User,
  nft: Nft,
}, {
  timestamps: true
});

export const UserNFTBought = model('UserNFTBought', UserNFTBoughtSchema);
