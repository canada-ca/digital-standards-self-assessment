import { connectDB } from '../db/db.connection';

import { MongoServerError } from 'mongodb';
import SurveyResultModel, { SurveyResult, SurveyResultDocument } from '../models/survey-result.model';

class SurveyResultService {
  constructor() {
    console.log('Construct SurveyResultService');
  }

  async create(surveyResult: SurveyResult) {
    surveyResult.archive = 'current';
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
      const surveyResults = await SurveyResultModel.find({ archive: 'current' })
        .populate('team')
        .populate('jobTitle')
        .exec();
      return surveyResults;
    } catch (err) {
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
        archive: 'current',
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

  async findArchiveNames(): Promise<string[]> {
    try {
      await connectDB();
      const data = await SurveyResultModel.find({ archive: { $ne: 'current' } }).distinct<string>('archive');
      data.unshift('current');
      return data;
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findByArchiveName(archiveName: string): Promise<SurveyResultDocument[]> {
    try {
      await connectDB();
      const surveyResults = await SurveyResultModel.find({ archive: archiveName })
        .populate('team')
        .populate('jobTitle')
        .exec();
      return surveyResults;
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async archive(archiveName: string): Promise<number> {
    try {
      await connectDB();
      if (!archiveName) {
        throw { message: 'archive name is required' };
      }
      const count = await SurveyResultModel.find({ archive: archiveName }).count();
      if (count > 0) {
        throw { message: 'This archive name was alredy used, please change another one.' };
      }
      const result = await SurveyResultModel.updateMany(
        { archive: { $eq: 'current' } },
        { $set: { archive: archiveName } }
      ).exec();
      return result.modifiedCount;
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
