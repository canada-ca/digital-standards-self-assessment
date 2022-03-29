import { connectDB } from '../db/db.connection';
import SurveyModel, { Survey, SurveyDocument } from '../models/survey.model';
import { MongoServerError } from 'mongodb';

class SurveyService {
  constructor() {
    console.log('Construct SurveyService');
  }

  async create(survey: Survey): Promise<SurveyDocument> {
    const surveyModel = new SurveyModel(survey);
    try {
      await connectDB();
      return await surveyModel.save();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async update(surveyId: string, survey: Partial<Survey>): Promise<SurveyDocument> {
    if (surveyId) {
      try {
        await connectDB();
        return await SurveyModel.findByIdAndUpdate(surveyId, survey, { useFindAndModify: false });
      } catch (err: any) {
        if (err instanceof MongoServerError) {
          throw { ...err, message: err.message };
        } else {
          throw err;
        }
      }
    }
  }

  async delete(surveyId: string): Promise<SurveyDocument> {
    try {
      await connectDB();
      return await SurveyModel.findByIdAndDelete(surveyId, { useFindAndModify: false }).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findById(surveyId: string): Promise<SurveyDocument> {
    try {
      await connectDB();
      return await SurveyModel.findById(surveyId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findLatest(): Promise<SurveyDocument> {
    try {
      await connectDB();
      const result = await SurveyModel.find();
      result.sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt === b.createdAt ? 0 : 1));
      return !!result && result.length > 0 ? result[0] : null;
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<SurveyDocument[]> {
    try {
      await connectDB();
      return await SurveyModel.find({}).exec();
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}

export default new SurveyService();
