import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';

export const UserSchema = new Schema({
  ...baseSchema,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
  password: {
    type: String,
    required: true,
  },
});
