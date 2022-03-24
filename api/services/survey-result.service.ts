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
      const surveyResults = await SurveyResultModel.find({}).populate('user', 'firstName lastName team').exec();
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
        .populate('user', 'firstName lastName team')
        .exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async delete(surveyId: string): Promise<SurveyResultDocument> {
    try {
      await connectDB();
      return await SurveyResultModel.findByIdAndDelete(surveyId, { useFindAndModify: false }).exec();
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
