import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';

export const UserSchema = new Schema({
  ...baseSchema,
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: {
      name: 'emailIndex',
      global: true,
    },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
});
