import { connectDB } from '../db/db.connection';

import { MongoServerError } from 'mongodb';
import SurveyResultModel, { SurveyResult, SurveyResultDocument } from '../models/survey-result.model';

class SurveyResultService {
  constructor() {
    console.log('Construct SurveyResultService');
  }

  async create(surveyResult: SurveyResult) {
    const surveyResultModel = new SurveyResultModel(surveyResult);
    try {
      await connectDB();
      return await surveyResultModel.save();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findOneById(resultId: string): Promise<SurveyResultDocument> {
    try {
      await connectDB();
      return await SurveyResultModel.findById(resultId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<SurveyResultDocument[]> {
    try {
      await connectDB();
      const surveyResults = await SurveyResultModel.find({}).populate('team').populate('jobTitle').exec();
      return surveyResults;
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findByDateRange(startDate?: Date, endDate?: Date): Promise<SurveyResultDocument[]> {
    const query = {};
    if (!startDate && !endDate) {
      throw new Error('From date and end date can not be all empty.');
    }
    if (startDate) {
      query['$gte'] = startDate;
    }
    if (endDate) {
      query['$lte'] = endDate;
    }
    try {
      await connectDB();
      return await SurveyResultModel.find({
        createdAt: query,
      })
        .populate('team')
        .populate('jobTitle')
        .exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findByUserId(userId: string): Promise<SurveyResultDocument[]> {
    if (!userId) {
      throw new Error('userId is required.');
    }

    try {
      await connectDB();
      return await SurveyResultModel.find({
        userId,
      })
        .populate('team')
        .populate('jobTitle')
        .exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async delete(surveyId?: string): Promise<number> {
    try {
      await connectDB();
      if (!!surveyId) {
        const result = await SurveyResultModel.findByIdAndDelete(surveyId, { useFindAndModify: false }).exec();
        if (result) {
          return 1;
        } else {
          return 0;
        }
      } else {
        const result = await SurveyResultModel.deleteMany({}).exec();
        return result.deletedCount;
      }
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}
export default new SurveyResultService();
