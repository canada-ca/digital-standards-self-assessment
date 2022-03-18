import { connectDB } from '../db/db.connection';
import SurveyModel, { Survey, SurveyDocument } from '../models/survey.model';
import { MongoServerError } from 'mongodb';

class SurveyService {
  constructor() {
    console.log('Construct SurveyService');
  }

  async createSurvey(survey: Survey): Promise<SurveyDocument> {
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

  async updateSurvey(surveyId: string, survey: Partial<Survey>): Promise<SurveyDocument> {
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

  async deleteSurvey(surveyId: string): Promise<SurveyDocument> {
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

  async findSurveyById(surveyId: string): Promise<SurveyDocument> {
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
