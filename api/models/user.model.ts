import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';

export type RoleEnum = 'Admin' | 'TeamLead' | 'TeamMember';

export interface User {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  team: string;
  roles: RoleEnum[];
  createdDate?: Date;
}

export interface UserDocument extends User, Document {
  fullName: string;
  comparePassword(password: string): string;
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    roles: [{ type: String, required: true }],
    createdDate: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'user' }
);

userSchema.virtual('fullName').get((thiz: UserDocument) => thiz.firstName + ' ' + thiz.lastName);

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default model<UserDocument>('User', userSchema);
