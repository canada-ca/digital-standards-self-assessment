interface BaseInterface {
  _id?: string;
}

export interface Team extends BaseInterface {
  teamId: number;
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

export interface Survey extends BaseInterface {
  pages: Section[];
  showQuestionNumbers: 'on' | 'off';
  showProgressBar: 'true' | 'false';
  showNavigationButtons: 'true' | 'false';
  createdAt?: Date;
}

export interface SurveyResult extends BaseInterface {
  answers: Map<string, any>;
  userId: string; // either email or a random string
  team: string | Team;
  jobTitle?: string | JobTitle;
  survey: string;
  createdAt?: Date;
}

export interface JobTitle extends BaseInterface {
  gcitCode: string;
  itLevel: string;
  titleEn: string;
  titleFr: string;
  shortTitleEn: string;
  shortTitleFr: string;
}
