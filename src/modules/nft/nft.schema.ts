import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';

export const NftSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    title: {
      type: String,
    },
    owner: {
      type: String,
    },
    price: {
      type: Number,
      required: false,
    },
    usdPrice: {
      type: Number,
      required: false,
    },
    imgLink: {
      type: String,
    },
    metadataPubkey: {
      type: String,
    },
    type: {
      type: String,
    },
    user: User,
  },
  {
    timestamps: true,
  },
);

export const Nft = model('Nft', NftSchema);
