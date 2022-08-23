import { Document, Model, model, Schema, Types } from 'mongoose';
import jobTitleModel, { JobTitle } from './job-title.model';
import surveyModel, { Survey } from './survey.model';
import teamModel, { Team } from './team.model';
export interface SurveyResult {
  archive: string;
  answers: { [key: string]: any };
  userId: string; // either email or a random string
  jobTitle: string | Types.ObjectId | JobTitle;
  team: string | Types.ObjectId | Team;
  survey: string | Types.ObjectId | Survey;
  createdAt: Date;
}

export interface SurveyResultDocument extends SurveyResult, Document {}

export interface SurveyResultModel extends Model<SurveyResultDocument> {}

const surveyResultSchema = new Schema<SurveyResultDocument, SurveyResultModel>(
  {
    archive: {
      type: String,
    },
    answers: {
      type: Map,
      of: String,
    },
    userId: {
      type: String,
    },
    jobTitle: {
      type: Types.ObjectId,
      ref: 'JobTitle',
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
  { collection: 'surveyResult' }
);

surveyResultSchema.pre('save', async function (next) {
  const teamId = this.team;
  const teamCount = await teamModel.countDocuments({ _id: teamId }).exec();
  if (teamCount === 0) {
    throw new Error(`Can not find team with id=${teamId}`);
  }
  const jobTitleId = this.jobTitle;
  const jobTitleCount = await jobTitleModel.countDocuments({ _id: jobTitleId }).exec();
  if (jobTitleCount === 0) {
    throw new Error(`Can not find jobTitle with id=${jobTitleId}`);
  }
  const surveyId = this.survey;
  const surveyCount = await surveyModel.countDocuments({ _id: surveyId }).exec();
  if (surveyCount === 0) {
    throw new Error(`The survey with id=${surveyId} does not exist`);
  }
  next();
});

export default model<SurveyResultDocument>('SurveyResult', surveyResultSchema);
