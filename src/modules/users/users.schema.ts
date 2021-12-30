import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';

export const UserSchema = new Schema({
  ...baseSchema,
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  password: {
    type: String,
  },
});
