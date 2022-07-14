import { Document, Schema, Model, model, Types } from 'mongoose';

export interface SectionGroup {
  sectionNames: string[];
  titleEn: string;
  titleFr: string;
}

export interface SectionGroupDocument extends SectionGroup, Document {}

export interface SectionGroupModel extends Model<SectionGroupDocument> {}

const sectionGroupSchema = new Schema<SectionGroupDocument, SectionGroupModel>(
  {
    sectionNames: {
      type: [String],
    },
    titleEn: {
      type: String,
    },
    titleFr: {
      type: String,
    },
  },
  { collection: 'sectionGroup' }
);

export default model<SectionGroupDocument>('SectionGroup', sectionGroupSchema);
