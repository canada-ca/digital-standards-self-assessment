import { connectDB } from '../db/db.connection';
import SectionGroupModel, { SectionGroup, SectionGroupDocument } from '../models/section-group.model';
import { MongoServerError } from 'mongodb';

class SectionGroupService {
  constructor() {
    console.log('Construct SectionGroupService');
  }

  async create(sectionGroup: SectionGroup): Promise<SectionGroupDocument> {
    const sectionGroupModel = new SectionGroupModel(sectionGroup);
    try {
      await connectDB();
      return await sectionGroupModel.save();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async delete(sectionGroupId: string): Promise<SectionGroupDocument> {
    try {
      await connectDB();
      return await SectionGroupModel.findByIdAndDelete(sectionGroupId, { useFindAndModify: false }).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findById(sectionGroupId: string): Promise<SectionGroupDocument> {
    try {
      await connectDB();
      return await SectionGroupModel.findById(sectionGroupId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<SectionGroupDocument[]> {
    try {
      await connectDB();
      return await SectionGroupModel.find({}).exec();
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}

export default new SectionGroupService();
