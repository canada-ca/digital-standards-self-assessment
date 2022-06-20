interface BaseInterface {
  _id?: string;
}

export interface Team extends BaseInterface {
  teamNameEn: string;
  teamNameFr: string;
}

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

export interface SurveyData extends BaseInterface {
  surveyName: string;
  createdAt?: Date;
  surveyJson: Survey;
}
export interface Survey extends BaseInterface {
  pages: Section[];
  showQuestionNumbers: 'on' | 'off';
  showProgressBar: 'true' | 'false';
  showNavigationButtons: 'true' | 'false';
}

export interface SurveyResult extends BaseInterface {
  answers: Map<string, any>;
  userEmail: string;
  team: string | Team;
  survey: string;
  createdAt?: Date;
}
