import * as bcrypt from 'bcrypt';
import { connectDB } from '../db/db.connection';
import UserModel, { IUser, UserDocument } from '../models/user.model';
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
    const userModel = new UserModel({ email, firstName, lastName, team, roles: ['TeamMember'] });
    userModel.password = bcrypt.hashSync(password, 10);
    try {
      await connectDB();
      const userDoc = await userModel.save();
      userDoc.password = undefined;
      return userDoc;
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async update(userId: string, user: Partial<IUser>): Promise<UserDocument> {
    if (userId) {
      try {
        await connectDB();
        const updatedUser = await UserModel.findByIdAndUpdate(userId, user, { useFindAndModify: false });
        if (updatedUser) {
          updatedUser.password = undefined;
        }
        return updatedUser;
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
      return await UserModel.find({}).exec();
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
      const deletedUser = await UserModel.findByIdAndDelete(userId, { useFindAndModify: false }).exec();
      if (deletedUser) {
        deletedUser.password = undefined;
      }
      return deletedUser;
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
