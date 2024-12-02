import mongoose, { model, Model, Schema } from 'mongoose';
import { toJSON } from './plugins';
import { tokenTypes } from '../config/tokens';

export interface ITokenSchema {
  token: string;
  user: string;
  type: tokenTypes;
  expires: string;
  blacklisted: boolean;
}

interface ITokenModel extends Model<ITokenSchema> {}

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON.default);

/**
 * @typedef Token
 */

const Token = model<ITokenSchema, ITokenModel>('Token', tokenSchema);

export default Token;
module.exports = Token;
