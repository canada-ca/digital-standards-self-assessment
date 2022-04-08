export default interface SurveyFile {
  fileName: string;
  hasError?: boolean;
  errorMessage?: string;
  currentPage: number;
  data?: any;
  surveyJSON?: any;
}
