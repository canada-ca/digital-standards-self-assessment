import { SurveyModel, PageModel } from "survey-vue";
import Vue from "vue";

export class Helpers extends Vue {
  returnSectionsByPrefix(surveyData: SurveyModel, prefix: string) {
    let sections: PageModel[] = [];
    surveyData.pages.forEach(page => {
      if (page.name.includes(prefix)) {
        sections.push(page);
      }
    });
    return sections;
  }
}
