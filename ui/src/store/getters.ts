import { GetterTree } from 'vuex';
import { Section, Recommendations, RootState, TeamReportData, UserReportData } from '@/store/state';
import { isEmpty } from 'lodash';
import { PageModel, SurveyModel } from 'survey-vue';

import { calcSectionMaxScore } from '@/utils/utils';
import { Profile } from '@/interfaces/Profile';
import { Team } from '@/interfaces/api-models';

export type Getters = {
  /**Checks whether the state status is errored or not
   * @param state The application state.
   * @returns Returns false if no error, true if error.
   */
  isStateError(state: RootState): boolean;
  /**
   * Checks whether the app data successfully loaded
   * @param state The application state.
   * @returns Returns true if app data successfully loaded, false otherwise
   * */
  isInitialized(state: RootState): boolean;
  /**
   * Checks whether the store has any user data saved.
   * @param state The application state.
   * @returns Returns true if data is saved, false if not
   */
  inProgress(state: RootState): boolean;
  /**
   * Returns all app sections names only
   * @param state The application state.
   * @returns An array of strings containing the sections names, an empty array if there no sections are available.
   * */
  returnSectionsNames(state: RootState): string[];
  /**
   * Returns a section if it's name is found, undefined if not.
   * @param state The application state.
   * @param sectionName A string containining the section name to evaluate
   * @returns A Section object if the sectionName is found, undefined if not found.
   */
  returnSectionByName(state: RootState): (sectionName: string) => Section | undefined;
  /**
   * Returns ```state.recommendations```.
   * @param state The application state.
   * @returns A ```Recommendations``` object if it was initialized, undefined otherwise.
   */
  returnRecommendations(state: RootState): Recommendations | undefined;
  /**
   * TODO: Move to helpers mixins
   * @param state The application state.
   */
  returnSectionsByPrefix(state: RootState): (surveyData: SurveyModel, prefix: string) => PageModel[];
  /**
   * Returns the current section from the store.
   * @param state The application state.
   * @returns A ```Section``` object if it was initialized, undefined otherwise.
   */
  returnCurrentSection(state: RootState): Section | undefined;
  /**
   * Returns ```state.toolData``` value from the store
   * @param state The application state.
   * returns ```any```
   */
  returnToolData(state: RootState): any;
  /**
   * Returns ```state.surveyModel``` from the store
   * @param state The application state.
   * @returns a ```SurveyModel``` object if initialized, undefined if not.
   */
  returnSurveyModel(state: RootState): SurveyModel | undefined;
  /**
   * Returns ```state.surveyJSON``` from the store
   * @param state The application state.
   * @returns a JSON object of survey defination
   */
  returnSurveyJSON(state: RootState): any;
  /**
   * Returns ```state.currentPageNumber``` from the store
   * @param state The application state.
   * @returns A number
   */
  returnCurrentPageNumber(state: RootState): number;
  // ---------------
  // Getters below are to help transition to new store structure
  // ---------------
  // This getter shouldn't be used anymore (see returnSectionsNames instead)
  returnSectionsNamesGenerated(state: RootState): string[];
  determineAllSections(state: RootState, payload: string): string[];
  returnSections(state: RootState): Section[];
  returnSectionPrefix(state: RootState): string;
  // Team Survey Data
  returnTeamReportDataArray(state: RootState): TeamReportData[];
  returnIndividualTeam(state: RootState): Team | undefined;
  returnIndividualTeamReportDataArray(state: RootState): UserReportData[];
  returnShowBreakdown(state: RootState): boolean;
  returnSectionMaxScore(state: RootState): (section: string) => number;
  returnProfile(state: RootState): Profile | undefined;
  returnShowProfile(state: RootState): boolean;
};

export const getters: GetterTree<RootState, RootState> & Getters = {
  isStateError(state: RootState) {
    return state.error;
  },
  isInitialized(state: RootState) {
    return state.initialized;
  },
  inProgress(state: RootState) {
    return !isEmpty(state.toolData);
  },
  returnSectionsNames(state: RootState) {
    return state.sectionsNames;
  },
  returnSectionByName(state: RootState) {
    return (sectionName: string) => {
      return state.sections.find((section) => section.sectionName === sectionName);
    };
  },
  returnRecommendations(state: RootState) {
    return state.recommendations;
  },
  returnSectionsByPrefix(state: RootState) {
    return (surveyData: SurveyModel, prefix: string) => {
      let sections: PageModel[] = [];
      surveyData.pages.forEach((page: any) => {
        if (page.name.includes(prefix)) {
          sections.push(page);
        }
      });
      return sections;
    };
  },
  returnCurrentSection(state: RootState) {
    return state.sections.find((section) => {
      return section.sectionName === state.currentPageName;
    });
  },
  returnSectionsNamesGenerated(state: RootState) {
    let sectionsNames: string[] = [];
    if (!!state.surveyModel) {
      state.surveyModel.pages.forEach((page: any) => {
        if (page.name.includes(state.sectionsPrefix)) {
          sectionsNames.push(page.name);
        }
      });
    }
    return sectionsNames;
  },
  determineAllSections(state: RootState, payload: string) {
    let sectionsNames: string[] = [];
    if (!!state.surveyModel) {
      state.surveyModel.pages.forEach((page: any) => {
        if (page.name.includes(payload)) {
          sectionsNames.push(page.name);
        }
      });
    }
    return sectionsNames;
  },
  // Should use mapstate instead
  returnToolData(state: RootState) {
    return state.toolData || {};
  },
  /* istanbul ignore next */
  returnSurveyModel(state: RootState) {
    return state.surveyModel;
  },
  /* istanbul ignore next */
  returnSurveyJSON(state: RootState) {
    return state.surveyJSON;
  },
  /* istanbul ignore next */
  returnCurrentPageNumber(state: RootState) {
    return state.currentPageNo;
  },
  /* istanbul ignore next */
  returnSections(state: RootState) {
    return state.sections;
  },
  /* istanbul ignore next */
  returnSectionPrefix(state: RootState) {
    return state.sectionsPrefix;
  },
  /* istanbul ignore next */
  returnTeamReportDataArray(state: RootState) {
    return state.teamAverageReportDataArray;
  },
  /* istanbul ignore next */
  returnIndividualTeam(state: RootState) {
    return state.individualTeam;
  },
  /* istanbul ignore next */
  returnIndividualTeamReportDataArray(state: RootState) {
    return state.individualTeamReportDataArray;
  },
  /* istanbul ignore next */
  returnShowBreakdown(state: RootState) {
    return state.showBreakdown;
  },
  /* istanbul ignore next */
  returnSectionMaxScore(state: RootState) {
    return (sectionName: string) => calcSectionMaxScore(sectionName, state.surveyJSON);
  },
  /* istanbul ignore next */
  returnProfile(state: RootState) {
    return state.profile;
  },
  /* istanbul ignore next */
  returnShowProfile(state: RootState) {
    return state.showProfile;
  },
  /* istanbul ignore next */
};
