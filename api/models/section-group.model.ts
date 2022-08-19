import { Document, Schema, Model, model, Types } from 'mongoose';

export interface SectionGroup {
  sectionNames: string[];
  titleEn: string;
  titleFr: string;
  displayOrder: number;
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
    displayOrder: {
      type: Number,
    },
  },
  { collection: 'sectionGroup' }
);

export default model<SectionGroupDocument>('SectionGroup', sectionGroupSchema);
