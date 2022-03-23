import { connectDB } from '../db/db.connection';
import UserModel, { User, UserDocument } from '../models/user.model';
import { MongoServerError } from 'mongodb';

class UserService {
  constructor() {
    console.log('Construct UserService');
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    team: string
  ): Promise<UserDocument> {
    const userModel = new UserModel({ email, firstName, lastName, team, password, roles: ['TeamMember'] });
    try {
      await connectDB();
      return await userModel.save();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async update(userId: string, user: Partial<User>): Promise<UserDocument> {
    if (userId) {
      try {
        await connectDB();
        return await UserModel.findByIdAndUpdate(userId, user, { useFindAndModify: false });
      } catch (err: any) {
        if (err instanceof MongoServerError) {
          throw { ...err, message: err.message };
        } else {
          throw err;
        }
      }
    }
  }

  async findOneById(userId: string): Promise<UserDocument> {
    try {
      await connectDB();
      return await UserModel.findById(userId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      await connectDB();
      return await UserModel.find({});
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async delete(userId: string): Promise<UserDocument> {
    try {
      await connectDB();
      return await UserModel.findByIdAndDelete(userId, { useFindAndModify: false }).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}

export default new UserService();
