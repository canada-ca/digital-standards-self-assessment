import QuestionReportData from "./QuestionReportData";

export default interface SectionReportData {
  name: string;
  score: number;
  questions: Array<QuestionReportData>;
  titleEn: string;
  titleFr: string;
}
