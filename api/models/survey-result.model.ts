import { Document, Model, model, Schema, Types } from 'mongoose';
import surveyModel, { Survey } from './survey.model';
import teamModel, { Team } from './team.model';
export interface SurveyResult {
  answers: Map<string, any>;
  userEmail: string;
  team: string | Types.ObjectId | Team;
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
    userEmail: {
      type: String,
    },
    team: {
      type: Types.ObjectId,
      ref: 'Team',
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
  const teamId = this.team;
  const teamCount = await teamModel.countDocuments({ _id: teamId }).exec();
  if (teamCount === 0) {
    throw new Error(`Can not find team with id=${teamId}`);
  }
  const surveyId = this.survey;
  const surveyCount = await surveyModel.countDocuments({ _id: surveyId }).exec();
  if (surveyCount === 0) {
    throw new Error(`The survey with id=${surveyId} does not exist`);
  }
  next();
});

export default model<SurveyResultDocument>('SurveyResult', surveyResultSchema);
