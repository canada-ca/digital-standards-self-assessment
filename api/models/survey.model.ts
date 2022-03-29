import { Document, Model, Schema, model } from 'mongoose';

export interface BilingleText {
  default: string;
  fr: string;
}

export interface BaseQuestion {
  type: string;
  name: string;
  title: BilingleText;
}

export interface RatingQuestion extends BaseQuestion {
  rateValues: [
    {
      value: string;
      text: BilingleText;
    }
  ];
  value?: string;
}

export interface SingleSelectQuestion extends BaseQuestion {
  choices: [
    {
      value: string;
      text: BilingleText;
    }
  ];
  value?: string;
}

export interface MultipleSelectQuestion extends BaseQuestion {
  choices: [
    {
      value: string;
      text: BilingleText;
    }
  ];
  value?: string[];
}

export type QuestionType = RatingQuestion | SingleSelectQuestion | MultipleSelectQuestion;

export interface Section {
  name: string;
  title: BilingleText;
  description: BilingleText;
  elements: QuestionType[];
}

export interface Survey {
  pages: Section[];
  showQuestionNumbers: 'on' | 'off';
  showProgressBar: 'true' | 'false';
  showNavigationButtons: 'true' | 'false';
  createdAt: Date;
}

export interface SurveyDocument extends Survey, Document {}

export interface SurveyModel extends Model<SurveyDocument> {}

const surveySchema = new Schema<SurveyDocument, SurveyModel>(
  {
    pages: [
      {
        name: {
          type: 'String',
        },
        title: {
          default: {
            type: 'String',
          },
          fr: {
            type: 'String',
          },
        },
        description: {
          default: {
            type: 'String',
          },
          fr: {
            type: 'String',
          },
        },
        elements: {
          type: [
            {
              type: {
                type: 'String',
              },
              name: {
                type: 'String',
              },
              title: {
                default: {
                  type: 'String',
                },
                fr: {
                  type: 'String',
                },
              },
              rateValues: {
                type: ['Mixed'],
              },
            },
          ],
        },
      },
    ],
    showQuestionNumbers: {
      type: 'String',
      default: 'off',
    },
    showProgressBar: {
      type: 'String',
      default: 'false',
    },
    showNavigationButtons: {
      type: 'String',
      default: 'false',
    },
    createdAt: {
      type: Date,
      index: true,
      default: new Date(),
    },
  },
  { collection: 'survey' }
);

export default model<SurveyDocument>('Survey', surveySchema);
