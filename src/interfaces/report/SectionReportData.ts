import QuestionReportData from "./QuestionReportData";

export default interface SectionReportData {
  name: string;
  score: number;
  maxScore: number;
  questions: Array<QuestionReportData>;
  title: string;
}
