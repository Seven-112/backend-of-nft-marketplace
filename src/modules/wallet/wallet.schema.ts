import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';

export const WalletSchema = new Schema({
  ...baseSchema,
  userId: {
    type: String,
    required: true,
    index: {
      name: 'walletUserIdIndex',
      global: true,
    },
  },
  address: {
    type: String,
    required: true,
    index: {
      name: 'walletAddressIndex',
      global: true,
    },
  },
  type: {
    type: String,
    required: true,
  },
});
