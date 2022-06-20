import { Document, Model, Schema, model } from 'mongoose';

export interface BilingualText {
  default: string;
  fr: string;
}

export interface BaseQuestion {
  type: string;
  name: string;
  title: BilingualText;
}

export interface RatingQuestion extends BaseQuestion {
  rateValues: [
    {
      value: string;
      text: BilingualText;
    }
  ];
  value?: string;
}

export interface SingleSelectQuestion extends BaseQuestion {
  choices: [
    {
      value: string;
      text: BilingualText;
    }
  ];
  value?: string;
}

export interface MultipleSelectQuestion extends BaseQuestion {
  choices: [
    {
      value: string;
      text: BilingualText;
    }
  ];
  value?: string[];
}

export type QuestionType = RatingQuestion | SingleSelectQuestion | MultipleSelectQuestion;

export interface Section {
  name: string;
  title: BilingualText;
  description: BilingualText;
  elements: QuestionType[];
}

export interface Survey {
  surveyName: 'Digital Standard Self-Assessment';
  surveyJson: {
    pages: Section[];
    showQuestionNumbers: 'on' | 'off';
    showProgressBar: 'true' | 'false';
    showNavigationButtons: 'true' | 'false';
  };
  createdAt: Date;
}

export interface SurveyDocument extends Survey, Document {}

export interface SurveyModel extends Model<SurveyDocument> {}

const surveySchema = new Schema<SurveyDocument, SurveyModel>(
  {
    surveyName: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    surveyJson: {
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
