import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';
export const FileSchema = new Schema({
  extension: {
    type: String,
  },
  url: {
    type: String,
  },
  name: {
    type: String,
  }
});

const ReplySchema = new Schema({
  user: User,
  username: String,
  email: String,
  content: String,
  file: FileSchema,
  timestamp: Number
})

export const Reply = model('replies', ReplySchema);

export const SupportSchema = new Schema(
  {
    id: {
      type: String,
    },
    ticket_uuid: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    blockchain: {
      type: String,
      required: true
    },
    transaction_hash: {
      type: String,
      required: true
    },
    wallet: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    file: FileSchema,
    timestamp: {
      type: Number,
      rangeKey: true
    },
    table: {
      type: String,
      default: 'support',
      hashKey: true
    },
    replies: {
      type: Array,
      schema: [{
        type: Object,
        schema: ReplySchema,
        model: Reply,
      }],
      default: []
    },
    status: {
      type: String,
      default: 'open',
      required: false
    }
  },
  {
    timestamps: true,
  },
);

export const Support = model('Supports', SupportSchema);
