/* eslint-disable security/detect-object-injection */
import {
  BilingualText,
  JobTitle,
  MultipleSelectQuestion,
  QuestionType,
  RatingQuestion,
  Section,
  SectionGroup,
  SingleSelectQuestion,
  Survey,
  SurveyResult,
  Team,
} from '@/interfaces/api-models';
import { allTimePositions } from '@/interfaces/TimeInPosition';
import VueI18n, { IVueI18n } from 'vue-i18n';

class ExportService {
  convertToDataArray(
    $i18n: VueI18n & IVueI18n,
    sectionGroups: SectionGroup[],
    surveyJson: Survey,
    surveyResults: SurveyResult[]
  ): Array<{ [key: string]: any }> {
    const locale = $i18n.locale;
    const data: Array<{ [key: string]: any }> = [];
    const teamLabel = $i18n.t('downloadUploadSurvey.team') as string;
    const itLevelLabel = $i18n.t('downloadUploadSurvey.itLevel') as string;
    const jobTitleLabel = $i18n.t('downloadUploadSurvey.jobTitle') as string;
    const timeInThePositionLabel = $i18n.t('downloadUploadSurvey.timeInThePosition') as string;

    for (const result of surveyResults) {
      const team: Team = result.team as Team;
      const jobTitle: JobTitle = result.jobTitle as JobTitle;
      const rowData: { [key: string]: any } = {};
      rowData[teamLabel] = locale === 'fr' ? team?.teamNameFr : team?.teamNameEn;
      rowData[itLevelLabel] = jobTitle?.itLevel;
      rowData[jobTitleLabel] = locale === 'fr' ? jobTitle?.titleFr : jobTitle?.titleEn;
      rowData[timeInThePositionLabel] = this.getTimeInPositionText(locale, result.timeInThePosition);

      for (const sectionGroup of sectionGroups) {
        // section group title column
        const sectionTitle = locale === 'fr' ? sectionGroup.titleFr : sectionGroup.titleEn;
        // eslint-disable-next-line security/detect-object-injection
        rowData[sectionTitle] = '';
        for (const sn of sectionGroup.sectionNames) {
          const section = surveyJson.pages.find((page) => page.name === sn);
          if (section) {
            // Section title column
            rowData[this.translateText(locale, section.title)] = '';
            this.getSectionResults(locale, rowData, result, section);
          }
        }
      }
      data.push(rowData);
    }
    return data;
  }

  private getTimeInPositionText(locale: string, value?: string) {
    if (value) {
      const item = allTimePositions.find((item) => item.value === value);
      return locale === 'fr' ? item?.titleFr : item?.titleEn;
    } else {
      return undefined;
    }
  }

  getSectionResults(locale: string, data: { [key: string]: any }, result: SurveyResult, section: Section) {
    for (const question of section.elements) {
      data[this.translateText(locale, question.title)] = this.getAnswer(locale, question, result);
    }
  }

  getAnswer(locale: string, question: QuestionType, result: SurveyResult) {
    const value = result.answers[question.name];
    if (!!value) {
      if (question.type === 'rating') {
        const answer = (question as RatingQuestion).rateValues.find((item) => item.value === value);
        return this.translateText(locale, answer?.text);
      } else if (question.type === 'radiogroup' || question.type === 'dropdown') {
        const answer = (question as SingleSelectQuestion).choices.find((item) => item.value === value);
        return this.translateText(locale, answer?.text);
      } else if (question.type === 'checkbox') {
        const filtered = (question as MultipleSelectQuestion).choices.filter(
          (ch) => (value as any[]).indexOf(ch.value) > -1
        );
        return filtered.map((item) => this.translateText(locale, item.text));
      }
    }
  }

  translateText(locale: string, text?: BilingualText): string {
    return locale === 'fr' ? text!.fr : text!.default;
  }
}

export default new ExportService();
