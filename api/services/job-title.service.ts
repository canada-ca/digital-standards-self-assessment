import { connectDB } from '../db/db.connection';
import JobTitleModel, { JobTitleDocument } from '../models/job-title.model';
import { MongoServerError } from 'mongodb';

class JobTitleService {
  constructor() {
    console.log('Construct JobTitleService');
  }

  async findById(teamId: string): Promise<JobTitleDocument> {
    try {
      await connectDB();
      return await JobTitleModel.findById(teamId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<JobTitleDocument[]> {
    try {
      await connectDB();
      return await JobTitleModel.find({}).exec();
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}

export default new JobTitleService();
