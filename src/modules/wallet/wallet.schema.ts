import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';

export const WalletSchema = new Schema({
  ...baseSchema,
  userId: {
    type: String,
    required: true,
    rangeKey: true,
  },
  address: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
