import { Schema, model } from 'dynamoose';

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
  },
  {
    timestamps: true,
  },
);

export const Nft = model('Nft', NftSchema);
