export default interface SurveyFile {
  fileName: string;
  hasError?: boolean;
  errorMessage?: string;
  currentPage: number;
  data?: any;
  surveyJSON?: any;
}

export interface Template {
  keys: string[];
  separator: string;
}
