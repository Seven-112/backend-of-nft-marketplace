import { Schema } from 'dynamoose';

export const NftSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    idToGetImg: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);
