import { Schema } from 'dynamoose';
import { baseSchema } from '../../common/model';

export const TodoSchema = new Schema({
  ...baseSchema,
  name: { type: String },
  isDone: { type: Boolean },
});
