import { Document, Schema, Model, model, Types } from 'mongoose';
import { Survey } from './survey.model';
import { User } from './user.model';
import userModel from './user.model';
import surveyModel from './survey.model';
export interface SurveyResult {
  answers: Map<string, any>;
  user: string | Types.ObjectId | User;
  survey: string | Types.ObjectId | Survey;
  createdAt: Date;
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
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'survey-result' }
);

surveyResultSchema.pre('save', async function (next) {
  const userId = this.user;
  const userCount = await userModel.countDocuments({ _id: userId }).exec();
  if (userCount === 0) {
    throw new Error(`The user with id=${userId} does not exist`);
  }
  const surveyId = this.survey;
  const surveyCount = await surveyModel.countDocuments({ _id: surveyId }).exec();
  if (surveyCount === 0) {
    throw new Error(`The survey with id=${surveyId} does not exist`);
  }
  next();
});

export default model<SurveyResultDocument>('SurveyResult', surveyResultSchema);
