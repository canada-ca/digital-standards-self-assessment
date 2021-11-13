import { MutationTree } from "vuex";
import { Recommendations, RootState, Section } from "@/store/state";
import { SurveyModel } from "survey-vue";

export enum MutationType {
  /**
   * Sets app loading error status as ```false``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingSuccess = "APP_LOADING_SUCCESS",
  /**
   * Sets app loading error status as ```true``` if successfully loaded app data
   * @param undefined
   */
  AppLoadingError = "APP_LOADING_ERROR",
  /**
   * Sets ```state.surveyModel``` with payload
   * @param payload Contains a ```SurveyModel``` object
   */
  SetSurveyModel = "SET_SURVEY_MODEL",
  /**Sets ```state.answerData``` with payload
   * @param payload Contains ```any``` array
   */
  SetAnswerData = "SET_ANSWER_DATA",
  /**Sets ```state.toolData``` with payload
   * @param payload Contains ```any```
   */
  SetToolData = "SET_TOOL_DATA",
  /**Sets ```state.sections``` with payload
   * @param payload Contains ```Section``` array
   */
  SetSections = "SET_SECTIONS",
  /**Sets ```state.sectionsNames``` with payload
   * @param payload Contains ```string``` array
   */
  SetSectionsNames = "SET_SECTIONS_NAMES",
  /**Sets ```state.currentPageNo``` with payload
   * @param payload Contains ```number```
   */
  SetCurrentPageNo = "SET_CURRENT_PAGE_NO",
  /**Sets ```state.currentPageName``` with payload
   * @param payload Contains ```string```
   */
  SetCurrentPageName = "SET_CURRENT_PAGE_NAME",
  /**
   * Updates a section with payload
   * @param payload Contains a ```Section``` object
   */
  UpdateSection = "UPDATE_SECTION",
  /**Sets ```state.recommendations``` with payload
   * @param payload Contains ```string```
   */
  SetRecommendations = "SET_RECOMMENDATIONS",
  /**
   * Sets ```state.displayWelcomeNotice``` with payload
   * @param payload Contains ```boolean```
   */
  SetDisplayNoticeStatus = "SET_DISPLAY_NOTICE_STATUS",
  /**Sets ```state.toolVersion``` with payload
   * @param payload Contains ```Recommendations``` object
   */
  SetToolVersion = "SET_TOOL_VERSION",
  /**Sets ```state.sectionsPrefix``` with payload
   * @param payload Contains ```string```
   */
  SetSectionsPrefix = "SET_SECTIONS_PREFIX",
  /**Sets ```state.loading``` to ```true```
   * @param payload Contains ```undefined```
   */
  StartLoading = "START_LOADING",
  /**Sets ```state.loading``` to ```false```
   * @param payload Contains ```undefined```
   */
  StopLoading = "STOP_LOADING",
  /**Sets ```state.initialized``` to ```true```
   * @param payload Contains ```undefined```
   */
  Initialized = "INITIALIZED"
}

export type Mutations = {
  [MutationType.AppLoadingSuccess](state: RootState): void;
  [MutationType.AppLoadingError](state: RootState): void;
  [MutationType.SetSurveyModel](state: RootState, payload: SurveyModel): void;
  [MutationType.SetAnswerData](state: RootState, payload: any[]): void;
  [MutationType.SetToolData](state: RootState, payload: any): void;
  [MutationType.SetSections](state: RootState, payload: Section[]): void;
  [MutationType.SetSectionsNames](state: RootState, payload: string[]): void;
  [MutationType.SetCurrentPageNo](state: RootState, payload: number): void;
  [MutationType.SetCurrentPageName](state: RootState, payload: string): void;
  // TODO: Need to fix State structure to simplify Recommendations
  [MutationType.UpdateSection](state: RootState, payload: Section): void;
  [MutationType.SetRecommendations](
    state: RootState,
    payload: Recommendations
  ): void;
  [MutationType.SetDisplayNoticeStatus](
    state: RootState,
    payload: boolean
  ): void;
  [MutationType.SetToolVersion](state: RootState, payload: string): void;
  [MutationType.SetSectionsPrefix](state: RootState, payload: string): void;
  [MutationType.StartLoading](state: RootState): void;
  [MutationType.StopLoading](state: RootState): void;
  [MutationType.Initialized](state: RootState): void;
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
  [MutationType.SetAnswerData](state: RootState, payload: any[]) {
    state.answerData = payload;
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
    state.sections = state.sections.map(section => {
      if (section.sectionName === payload.sectionName) {
        return { ...section, ...payload };
      }
      return section;
    });
  },
  [MutationType.SetRecommendations](
    state: RootState,
    payload: Recommendations
  ) {
    state.recommendations = payload;
  },
  [MutationType.SetDisplayNoticeStatus](state: RootState, payload: boolean) {
    state.displayWelcomeNotice = Object.freeze(payload);
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
  }
};
