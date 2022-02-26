import mongoose from 'mongoose';

interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  scores: Map<string, number>;
}

interface UserDoc extends mongoose.Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  scores: Map<string, number>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
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
    email: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    scores: {
      type: Map,
      required: true,
    },
  },
  { collection: 'users' }
);
const User = mongoose.model<IUser>('User', userSchema);
export { User, IUser };
