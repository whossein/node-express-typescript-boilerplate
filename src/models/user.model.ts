import mongoose, { Model, model, ObjectId, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSON.plugin';
import { roles } from '../config/roles';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser {
  id: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: (typeof roles)[number];
  isEmailVerified: boolean;
}

export interface IUserFilter {}
export interface IUserOptions {
  sortBy?: 'desc' | 'asc';
  limit?: number;
  page?: number;
}
interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: ObjectId): boolean;
  paginate(filter: IUserFilter, options: IUserOptions): Promise<IUser[]>;
  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number',
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// @ts-ignore
userSchema.plugin(toJSON);
// @ts-ignore
userSchema.plugin(mongoosePaginate);

userSchema.static(
  'isEmailTaken',
  async (email: string, excludeUserId?: ObjectId) => {
    // @ts-ignore
    const user = await this?.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  },
);

userSchema.method('isPasswordMatch', async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password || '');
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUser, IUserModel>('User', userSchema);

module.exports = User;
export default User;
