import { Document, Schema, Model, model, Types } from 'mongoose';
export interface Team {
  teamId: number;
  teamNameEn: string;
  teamNameFr: string;
}

export interface TeamDocument extends Team, Document {}

export interface TeamModel extends Model<TeamDocument> {}

const teamSchema = new Schema<TeamDocument, TeamModel>(
  {
    teamId: {
      type: Number,
    },
    teamNameEn: {
      type: String,
    },
    teamNameFr: {
      type: String,
    },
  },
  { collection: 'team' }
);

export default model<TeamDocument>('Team', teamSchema);
