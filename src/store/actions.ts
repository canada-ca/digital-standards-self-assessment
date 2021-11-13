import { ActionTree, ActionContext } from "vuex";
import { Mutations, MutationType } from "@/store/mutations";
import { RootState, Section, state } from "@/store/state";
import appConfig from "@/survey-results.json";
import appData from "@/survey-enfr.json";
import { PageModel, Model, SurveyModel } from "survey-vue";

//TODO: use config file to trigger local vs remote data fetch
// at build time
const appConfigSettings = appConfig.settings;
const recommendations = appConfig;

export enum ActionTypes {
  /**
   * Fetches app data from provided API URL and sets ```state.surveyModel``` with response body.
   * If successfull, sets ```state.error``` to ```false```.
   * If not successfull, sets ```state.error``` to ```true```.
   * @param value ```string``` containing API URL
   */
  FetchAppData = "FETCH_APP_DATA",
  /**
   * Fetches app data from local file and sets ```state.surveyModel``` with content.
   * If successfull, sets ```state.error``` to ```false```.
   * If not successfull, sets ```state.error``` to ```true```.
   * @param value ```undefined```
   */
  GetLocalAppData = "GET_LOCAL_APP_DATA",
  /**
   * Sets app data with ```state.surveyModel```.
   * If successfull, sets ```state.initialized``` to ```true```.
   * If not successfull, sets ```state.initialized``` to ```false```.
   * @param value ```undefined```
   */
  SetAppData = "SET_APP_DATA",
  /**
   * Saves current session app data with content of value.
   * Updates both ```state.answerData``` and ```state.toolData```
   * @param value an ```SurveyModel``` object
   */
  SaveAppData = "SAVE_APP_DATA",
  /**
   * Sets sections with content of value.
   * @param value an ```SurveyModel``` object
   */
  SetSections = "SET_SECTIONS",
  /**
   * Sets ```state.currentPageName``` and ```state.currentPageNo``` with content of value.
   * @param value an ```SurveyModel``` object
   */
  SetCurrentSection = "SET_CURRENT_SECTION",
  /**
   * Updates a matching section in ```state.sections```with content of value.
   * @param value.answerData ```any[]```
   * @param value.toolData ```any```
   */
  UpdateSectionAnswers = "UPDATE_SECTION_ANSWERS",
  /**
   * Updates a matching section score in ```state.sections```with content of value.
   * @param value an ```PageModel``` object
   */
  UpdateSectionScore = "UPDATE_SECTIONS_SCORES",
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  /**
   * Action to update the Survey Data
   * @param
   */
  UpdateSurveyData = "UPDATE_SURVEY_DATA",
  UpdateDisplayNotice = "UPDATE_DISPLAY_NOTICE",
  UpdateCurrentPageName = "UPDATE_CURRENT_PAGE_NAME"
}

type ActionAugments = Omit<ActionContext<RootState, RootState>, "commit"> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};

export type Actions = {
  [ActionTypes.FetchAppData](context: ActionAugments, value: string): void;
  [ActionTypes.GetLocalAppData](context: ActionAugments): void;
  [ActionTypes.SetAppData](context: ActionAugments): void;
  [ActionTypes.SaveAppData](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.SetSections](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.SetCurrentSection](
    context: ActionAugments,
    value: { sectionNo: number; sectionPageName: string }
  ): void;
  [ActionTypes.UpdateSectionAnswers](
    context: ActionAugments,
    value: { answerData: any[]; toolData: any }
  ): void;
  [ActionTypes.UpdateSectionScore](
    context: ActionAugments,
    value: PageModel
  ): void;
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  [ActionTypes.UpdateSurveyData](
    context: ActionAugments,
    value: SurveyModel
  ): void;
  [ActionTypes.UpdateDisplayNotice](
    context: ActionAugments,
    value: boolean
  ): void;
  [ActionTypes.UpdateCurrentPageName](
    context: ActionAugments,
    value: string
  ): void;
};

export const actions: ActionTree<RootState, RootState> & Actions = {
  async [ActionTypes.FetchAppData]({ commit }, value) {
    // commit(MutationType.StartLoading, undefined);
    let remoteAppData: Model;
    fetch(value)
      .then(response => response.json()) // one extra step
      .then(data => {
        remoteAppData = new Model(data);
        if (remoteAppData) {
          commit(MutationType.SetSurveyModel, remoteAppData);
          commit(MutationType.AppLoadingSuccess, undefined);
        } else {
          commit(MutationType.AppLoadingError, undefined);
        }
      });
    // .catch(error => console.error(error));
    // commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.GetLocalAppData]({ commit, getters }) {
    const thisAppData: Model = new Model(appData);
    commit(MutationType.SetSurveyModel, thisAppData);
    if (getters.returnSurveyModel !== undefined) {
      commit(MutationType.AppLoadingSuccess, undefined);
    } else {
      commit(MutationType.AppLoadingError, undefined);
    }
  },
  async [ActionTypes.SetAppData]({ commit, dispatch, getters }) {
    commit(MutationType.StartLoading, undefined);
    // Get local app data and define state.surveyModel
    dispatch(ActionTypes.GetLocalAppData);
    // If successfully loaded surveyModel, set all properties
    if (getters.isStateError === false) {
      let thisSurveyModel: SurveyModel = getters.returnSurveyModel;
      commit(MutationType.SetSurveyModel, thisSurveyModel);
      commit(MutationType.SetSectionsPrefix, appConfigSettings.sectionsPrefix);
      commit(MutationType.SetCurrentPageNo, thisSurveyModel.currentPageNo);
      commit(MutationType.SetCurrentPageName, "");
      commit(MutationType.SetRecommendations, recommendations);
      let sectionsNames: string[] = getters.returnSectionsNames as string[];
      if (sectionsNames.length === 0) {
        sectionsNames = getters.returnSectionsNamesGenerated;
        commit(MutationType.SetSectionsNames, sectionsNames);
      }
      let sections: Section[] = getters.returnSections as Section[];
      if (sections.length === 0) {
        dispatch(ActionTypes.SetSections, thisSurveyModel);
      }
      let toolData: any = getters.returnToolData;
      commit(MutationType.SetToolData, toolData);
      commit(MutationType.SetToolVersion, appConfigSettings.version);
      commit(MutationType.SetDisplayNoticeStatus, state.displayWelcomeNotice);
      commit(MutationType.Initialized, undefined);
    }
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SaveAppData]({ commit }, value: SurveyModel) {
    commit(MutationType.StartLoading, undefined);
    commit(MutationType.SetAnswerData, value.getPlainData());
    commit(MutationType.SetToolData, value.data);
    commit(MutationType.StopLoading, undefined);
  },
  async [ActionTypes.SetSections]({ commit, getters }, value: SurveyModel) {
    let sections: Section[] = [];
    if (getters.returnSectionsNames.length > 0) {
      const sectionNames: string[] = getters.returnSectionsNames;
      sectionNames.forEach(sectionName => {
        let newSection: Section = {
          sectionName: sectionName,
          enabled: false,
          completed: false,
          questionsNames: [],
          userScore: 0,
          maxScore: (value.getPageByName(sectionName).questions.length - 1) * 7,
          questions: []
        };
        value.getPageByName(sectionName).questions.forEach(question => {
          newSection.questionsNames.push(question.name);
          newSection.questions.push(question);
        });
        sections.push(newSection);
      });
      commit(MutationType.SetSections, sections);
    }
  },
  async [ActionTypes.SetCurrentSection](
    { commit },
    value: { sectionNo: number; sectionPageName: string }
  ) {
    commit(MutationType.SetCurrentPageNo, value.sectionNo);
    commit(MutationType.SetCurrentPageName, value.sectionPageName);
  },
  async [ActionTypes.UpdateSectionAnswers](
    { commit },
    value: { answerData: any[]; toolData: any }
  ) {
    commit(MutationType.SetAnswerData, value.answerData);
    commit(MutationType.SetToolData, value.toolData);
  },
  async [ActionTypes.UpdateSectionScore](
    { commit, getters },
    value: PageModel
  ) {
    let sectionScore: number = 0;
    let section: Section = getters.returnSectionByName(value.name);
    if (section !== undefined) {
      value.questions.forEach(question => {
        if (question.value !== undefined) {
          let score: number = +question.value;
          sectionScore += score;
        }
      });
      section.userScore = sectionScore;
      commit(MutationType.UpdateSection, section);
    }
  },
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  async [ActionTypes.UpdateSurveyData](
    { commit, dispatch, getters },
    value: SurveyModel
  ) {
    commit(MutationType.SetCurrentPageNo, value.currentPageNo);
    if (getters.returnRecommendations === undefined) {
      commit(MutationType.SetRecommendations, appConfig);
    }
    // let currentPage: PageModel = value.getPageByName(value.currentPage);
    // dispatch(ActionTypes.UpdateSectionScore, currentPage);

    //Updating all sections instead as per current behavior
    let allPages: PageModel[] = value.pages;
    allPages.forEach(page => {
      dispatch(ActionTypes.UpdateSectionScore, page);
    });
    commit(MutationType.SetToolData, value.data);
    commit(
      MutationType.SetAnswerData,
      value.getPlainData({ includeEmpty: false })
    );
  },
  async [ActionTypes.UpdateDisplayNotice]({ commit }, value: boolean) {
    commit(MutationType.SetDisplayNoticeStatus, value);
  },
  async [ActionTypes.UpdateCurrentPageName]({ commit }, value: string) {
    if (value.length > 0) {
      commit(MutationType.SetCurrentPageName, value);
    }
  }
};
