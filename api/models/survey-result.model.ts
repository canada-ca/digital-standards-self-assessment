import { Document, Schema, Model, model, Types } from 'mongoose';
import { Survey } from './survey.model';
import { User } from './user.model';

export interface SurveyResult {
  answers: Map<string, any>;
  user: string | Types.ObjectId | User;
  survey: string | Types.ObjectId | Survey;
}

export interface SurveyResultDocument extends SurveyResult, Document {}

export interface SurveyResultModel extends Model<SurveyResultDocument> {}

const surveyResultSchema = new Schema<SurveyResultDocument, SurveyResultModel>(
  {
    answers: {
      type: Map,
      of: String,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
    },
    survey: {
      type: Types.ObjectId,
      ref: 'Survey',
    },
  },
  { collection: 'survey-result' }
);

export default model<SurveyResultDocument>('SurveyResult', surveyResultSchema);
