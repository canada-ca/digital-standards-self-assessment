import { connectDB } from '../db/db.connection';

import { MongoServerError } from 'mongodb';
import SurveyResultModel, { SurveyResult } from '../models/survey-result.model';

class SurveyResultService {
  constructor() {
    console.log('Construct SurveyResultService');
  }

  async createSurveyResult(surveyResult: SurveyResult) {
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
}

export default new SurveyResultService();
