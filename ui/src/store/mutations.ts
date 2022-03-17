import { MutationTree } from 'vuex';
import { Recommendations, RootState, Section, TeamReportData, TeamReportDataBundle } from '@/store/state';
import { SurveyModel } from 'survey-vue';

export enum MutationType {
  /**
   * Sets app loading error status as ```false``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingSuccess = 'APP_LOADING_SUCCESS',
  /**
   * Sets app loading error status as ```true``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingError = 'APP_LOADING_ERROR',
  /**
   * Sets ```state.surveyModel``` with payload
   * @param payload Contains a ```SurveyModel``` object
   */
  SetSurveyModel = 'SET_SURVEY_MODEL',
  /**Sets ```state.toolData``` with payload
   * @param payload Contains ```any```
   */
  SetToolData = 'SET_TOOL_DATA',
  /**Sets ```state.sections``` with payload
   * @param payload Contains ```Section``` array
   */
  SetSections = 'SET_SECTIONS',
  /**Sets ```state.sectionsNames``` with payload
   * @param payload Contains ```string``` array
   */
  SetSectionsNames = 'SET_SECTIONS_NAMES',
  /**Sets ```state.currentPageNo``` with payload
   * @param payload Contains ```number```
   */
  SetCurrentPageNo = 'SET_CURRENT_PAGE_NO',
  /**Sets ```state.currentPageName``` with payload
   * @param payload Contains ```string```
   */
  SetCurrentPageName = 'SET_CURRENT_PAGE_NAME',
  /**
   * Updates a section with payload
   * @param payload Contains a ```Section``` object
   */
  UpdateSection = 'UPDATE_SECTION',
  /**Sets ```state.recommendations``` with payload
   * @param payload Contains ```string```
   */
  SetRecommendations = 'SET_RECOMMENDATIONS',
  /**Sets ```state.toolVersion``` with payload
   * @param payload Contains ```Recommendations``` object
   */
  SetToolVersion = 'SET_TOOL_VERSION',
  /**Sets ```state.sectionsPrefix``` with payload
   * @param payload Contains ```string```
   */
  SetSectionsPrefix = 'SET_SECTIONS_PREFIX',
  /**Sets ```state.loading``` to ```true```
   * @param payload Contains ```undefined```
   */
  StartLoading = 'START_LOADING',
  /**Sets ```state.loading``` to ```false```
   * @param payload Contains ```undefined```
   */
  StopLoading = 'STOP_LOADING',
  /**Sets ```state.initialized``` to ```true```
   * @param payload Contains ```undefined```
   */
  Initialized = 'INITIALIZED',
  SetSurveyJSON = 'SET_SURVEY_JSON',
  // Team Survey Mutations
  AddTeamSurvey = 'ADD_TEAM_SURVEY',
  DeleteTeamSurvey = 'DELETE_TEAM_SURVEY',
  ShowIndividualBreakdown = 'SHOW_INDIVIDUAL_BREAKDOWN',
  HideIndividualBreakdown = 'HIDE_INDIVIDUAL_BREAKDOWN',
}

export type Mutations = {
  [MutationType.AppLoadingSuccess](state: RootState): void;
  [MutationType.AppLoadingError](state: RootState): void;
  [MutationType.SetSurveyModel](state: RootState, payload: SurveyModel): void;
  [MutationType.SetToolData](state: RootState, payload: any): void;
  [MutationType.SetSections](state: RootState, payload: Section[]): void;
  [MutationType.SetSectionsNames](state: RootState, payload: string[]): void;
  [MutationType.SetCurrentPageNo](state: RootState, payload: number): void;
  [MutationType.SetCurrentPageName](state: RootState, payload: string): void;
  // TODO: Need to fix State structure to simplify Recommendations
  [MutationType.UpdateSection](state: RootState, payload: Section): void;
  [MutationType.SetRecommendations](state: RootState, payload: Recommendations): void;
  [MutationType.SetToolVersion](state: RootState, payload: string): void;
  [MutationType.SetSectionsPrefix](state: RootState, payload: string): void;
  [MutationType.StartLoading](state: RootState): void;
  [MutationType.StopLoading](state: RootState): void;
  [MutationType.Initialized](state: RootState): void;
  [MutationType.SetSurveyJSON](state: RootState, payload: any): void;
  [MutationType.AddTeamSurvey](state: RootState, payload: TeamReportDataBundle): void;
  [MutationType.DeleteTeamSurvey](state: RootState, payload: string): void;
  [MutationType.ShowIndividualBreakdown](state: RootState, payload: string): void;
  [MutationType.HideIndividualBreakdown](state: RootState): void;
};

export const mutations: MutationTree<RootState> & Mutations = {
  [MutationType.AppLoadingSuccess](state: RootState) {
    state.error = false;
  },
  [MutationType.AppLoadingError](state: RootState) {
    state.error = true;
  },
  [MutationType.SetSurveyModel](state: RootState, payload: SurveyModel) {
    state.surveyModel = payload;
  },
  [MutationType.SetToolData](state: RootState, payload: any) {
    state.toolData = Object.freeze(payload);
  },
  [MutationType.SetSectionsNames](state: RootState, payload: string[]) {
    state.sectionsNames = payload;
  },
  [MutationType.SetSections](state: RootState, payload: Section[]) {
    state.sections = payload;
  },
  [MutationType.SetCurrentPageNo](state: RootState, payload: number) {
    state.currentPageNo = payload;
  },
  [MutationType.SetCurrentPageName](state: RootState, payload: string) {
    state.currentPageName = payload;
  },
  [MutationType.UpdateSection](state: RootState, payload: Section) {
    state.sections = state.sections.map((section) => {
      if (section.sectionName === payload.sectionName) {
        return { ...section, ...payload };
      }
      return section;
    });
  },
  [MutationType.SetRecommendations](state: RootState, payload: Recommendations) {
    state.recommendations = payload;
  },
  [MutationType.SetToolVersion](state: RootState, payload: string) {
    state.toolVersion = payload;
  },
  [MutationType.SetSectionsPrefix](state: RootState, payload: string) {
    state.sectionsPrefix = payload;
  },
  [MutationType.StartLoading](state: RootState) {
    state.loading = true;
  },
  [MutationType.StopLoading](state: RootState) {
    state.loading = false;
  },
  [MutationType.Initialized](state: RootState) {
    state.initialized = true;
  },
  [MutationType.SetSurveyJSON](state: RootState, payload: any) {
    state.surveyJSON = payload;
  },
  [MutationType.AddTeamSurvey](state: RootState, payload: TeamReportDataBundle) {
    const index = state.teamReportDataBundleArray.findIndex((d) => d.teamName === payload.teamName);
    if (index === -1) {
      state.teamReportDataBundleArray.push(payload);
    } else {
      state.teamReportDataBundleArray.splice(index, 1, payload);
    }
    const avgIndex = state.teamAverageReportDataArray.findIndex((d) => d.name === payload.teamName);
    if (avgIndex === -1) {
      state.teamAverageReportDataArray.push(payload.teamAverageReportData);
    } else {
      state.teamAverageReportDataArray.splice(avgIndex, 1, payload.teamAverageReportData);
    }
  },
  [MutationType.DeleteTeamSurvey](state: RootState, payload: string) {
    let index = state.teamReportDataBundleArray.findIndex((d) => d.teamName === payload);
    if (index > -1) {
      state.teamReportDataBundleArray.splice(index, 1);
    }
    index = state.teamAverageReportDataArray.findIndex((d) => d.name === payload);
    if (index > -1) {
      state.teamAverageReportDataArray.splice(index, 1);
    }
    if (payload === state.individualTeamName) {
      state.individualTeamName = '';
      state.showBreakdown = false;
      state.individualTeamReportDataArray = [];
    }
  },
  [MutationType.ShowIndividualBreakdown](state: RootState, payload: string) {
    const reportDataBundle = state.teamReportDataBundleArray.find((d) => d.teamName === payload);
    if (reportDataBundle) {
      state.individualTeamName = payload;
      state.individualTeamReportDataArray = reportDataBundle.teamReportDataArray;
      state.showBreakdown = true;
    }
  },
  [MutationType.HideIndividualBreakdown](state: RootState) {
    state.individualTeamName = '';
    state.individualTeamReportDataArray = [];
    state.showBreakdown = false;
  },
};
