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

class ExportService {
  convertToDataArray(
    locale: string,
    sectionGroups: SectionGroup[],
    surveyJson: Survey,
    surveyResults: SurveyResult[]
  ): Array<{ [key: string]: any }> {
    const data: Array<{ [key: string]: any }> = [];
    for (const result of surveyResults) {
      const team: Team = result.team as Team;
      const jobTitle: JobTitle = result.jobTitle as JobTitle;
      const rowData: { [key: string]: any } = {
        'Your Department': locale === 'fr' ? team?.teamNameFr : team?.teamNameEn,
        'Your Position Level': jobTitle?.itLevel,
        'Time in the Position': result.timeInThePosition,
        'Position Title': locale === 'fr' ? jobTitle?.titleFr : jobTitle?.titleEn,
      };

      for (const sectionGroup of sectionGroups) {
        // section group title column
        const sectionTitle = locale === 'fr' ? sectionGroup.titleFr : sectionGroup.titleEn;
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

  getSectionResults(locale: string, data: { [key: string]: any }, result: SurveyResult, section: Section) {
    for (const question of section.elements) {
      data[this.translateText(locale, question.title)] = this.getAnswer(locale, question, result);
    }
  }

  getAnswer(locale: string, question: QuestionType, result: SurveyResult) {
    const value = result.answers.get(question.name);
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
