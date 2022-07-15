import { MutationTree } from 'vuex';
import { Recommendations, RootState, Section, state, TeamReportData, TeamReportDataBundle } from '@/store/state';
import { SurveyModel } from 'survey-vue';
import { Profile } from '@/interfaces/Profile';
import store from '.';
import { SectionGroup } from '@/interfaces/api-models';

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
  DeleteTeamSurvey = 'DELETE_TEAM_SURVEY',
  SetTeamSurveys = 'SET_TEAM_SURVEYS',
  ShowIndividualBreakdown = 'SHOW_INDIVIDUAL_BREAKDOWN',
  HideIndividualBreakdown = 'HIDE_INDIVIDUAL_BREAKDOWN',
  SaveProfile = 'SAVE_PROFILE',
  ShowHideProfile = 'TOGGLE_PROFILE',
  ResetSectionScores = 'RESET_SECTION_SCORES',
  SetSectionGroups = 'SET_SECTION_GROUPS',
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
  [MutationType.DeleteTeamSurvey](state: RootState, payload: string): void;
  [MutationType.SetTeamSurveys](state: RootState, payload: TeamReportDataBundle[]): void;
  [MutationType.ShowIndividualBreakdown](state: RootState, payload: string): void;
  [MutationType.HideIndividualBreakdown](state: RootState): void;
  [MutationType.SaveProfile](state: RootState, profile: Profile): void;
  [MutationType.ShowHideProfile](state: RootState, show: boolean): void;
  [MutationType.ResetSectionScores](state: RootState): void;
  [MutationType.SetSectionGroups](state: RootState, sectionGroups: SectionGroup[]): void;
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
  [MutationType.DeleteTeamSurvey](state: RootState, payload: string) {
    let index = state.teamReportDataBundleArray.findIndex((d) => d.teamId === payload);
    if (index > -1) {
      state.teamReportDataBundleArray.splice(index, 1);
    }
    index = state.teamAverageReportDataArray.findIndex((d) => d.teamId === payload);
    if (index > -1) {
      state.teamAverageReportDataArray.splice(index, 1);
    }
    if (state.individualTeam && state.individualTeam._id === payload) {
      state.individualTeam = undefined;
      state.showBreakdown = false;
      state.individualTeamReportDataArray = [];
    }
  },
  [MutationType.SetTeamSurveys](state: RootState, payload: TeamReportDataBundle[]) {
    state.teamReportDataBundleArray = [...payload];
    const teamAverageReportDataArray: TeamReportData[] = [];
    state.teamReportDataBundleArray.forEach((bundle) => {
      teamAverageReportDataArray.push(bundle.teamAverageReportData);
    });
    state.teamAverageReportDataArray = teamAverageReportDataArray;
  },
  [MutationType.ShowIndividualBreakdown](state: RootState, payload: string) {
    const reportDataBundle = state.teamReportDataBundleArray.find((d) => d.teamId === payload);
    if (reportDataBundle) {
      state.individualTeam = reportDataBundle.team;
      state.individualTeamReportDataArray = reportDataBundle.userReportDataArray;
      state.showBreakdown = true;
    }
  },
  [MutationType.HideIndividualBreakdown](state: RootState) {
    state.individualTeam = undefined;
    state.individualTeamReportDataArray = [];
    state.showBreakdown = false;
  },
  [MutationType.SaveProfile](state: RootState, profile: Profile) {
    state.profile = profile;
  },
  [MutationType.ShowHideProfile](state: RootState, show: boolean) {
    state.showProfile = show;
  },
  [MutationType.ResetSectionScores](state: RootState) {
    state.toolData = {};
    const sections = [...state.sections];
    sections.forEach((section) => (section.userScore = 0));
    state.sections = sections;
  },
  [MutationType.SetSectionGroups](state: RootState, sectionGroups: SectionGroup[]) {
    state.sectionGroups = sectionGroups;
  },
};
