import { Document, Schema, Model, model, Types } from 'mongoose';
export interface JobTitle {
  gcitCode: string;
  itLevel: string;
  titleEn: string;
  titleFr: string;
  shortTitleEn: string;
  shortTItleFr: string;
}

export interface JobTitleDocument extends JobTitle, Document {}

export interface JobTitleModel extends Model<JobTitleDocument> {}

const jobTitleSchema = new Schema<JobTitleDocument, JobTitleDocument>(
  {
    gcitCode: {
      type: String,
    },
    itLevel: {
      type: String,
    },
    titleEn: {
      type: String,
    },
    titleFr: {
      type: String,
    },
    shortTitleEn: {
      type: String,
    },
    shortTItleFr: {
      type: String,
    },
  },
  { collection: 'jobTitle' }
);

export default model<JobTitleDocument>('JobTitle', jobTitleSchema);
