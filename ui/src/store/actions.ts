import { Mutations, MutationType } from '@/store/mutations';
import { RootState, Section, TeamReportDataBundle } from '@/store/state';
import appData from '@/survey-enfr.json';
import appConfig from '@/survey-results.json';
import { calcScore } from '@/utils/utils';
import { PageModel, SurveyModel } from 'survey-vue';
import { ActionContext, ActionTree } from 'vuex';

//TODO: use config file to trigger local vs remote data fetch
// at build time
const appConfigSettings = appConfig.settings;
const recommendations = appConfig;

export enum ActionTypes {
  /**
   * Fetches app data from local file and sets ```state.surveyModel``` with content.
   * If successfull, sets ```state.error``` to ```false```.
   * If not successfull, sets ```state.error``` to ```true```.
   * @param value ```undefined```
   */
  GetLocalAppData = 'GET_LOCAL_APP_DATA',
  /**
   * Sets app data with ```state.surveyModel```.
   * If successfull, sets ```state.initialized``` to ```true```.
   * If not successfull, sets ```state.initialized``` to ```false```.
   * @param value ```undefined```
   */
  SetAppData = 'SET_APP_DATA',
  /**
   * Sets sections with content of value.
   * @param value an ```SurveyModel``` object
   */
  SetSections = 'SET_SECTIONS',
  /**
   * Updates a matching section score in ```state.sections```with content of value.
   * @param value an ```PageModel``` object
   */
  UpdateSectionScore = 'UPDATE_SECTIONS_SCORES',
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  /**
   * Action to update the Survey Data
   * @param
   */
  UpdateSurveyData = 'UPDATE_SURVEY_DATA',
  UpdateCurrentPageName = 'UPDATE_CURRENT_PAGE_NAME',
  UseSurveyJSON = 'USE_SURVEY_JSON',

  // Actions for team survey
  AddTeamSurvey = 'ADD_TEAM_SURVEY',
  DeleteTeamSurvey = 'DELETE_TEAM_SURVEY',
  ShowIndividualBreakdown = 'SHOW_INDIVIDUAL_BREAKDOWN',
  HideIndividualBreakdown = 'HIDE_INDIVIDUAL_BREAKDOWN',
}

export type ActionAugments = Omit<ActionContext<RootState, RootState>, 'commit'> & {
  commit<K extends keyof Mutations>(key: K, payload?: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
};

export type Actions = {
  [ActionTypes.GetLocalAppData](context: ActionAugments): void;
  [ActionTypes.SetAppData](context: ActionAugments): void;
  [ActionTypes.SetSections](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.UpdateSectionScore](context: ActionAugments, value: PageModel): void;
  // ---------------
  //Actions below are to help transition to new store structure
  // ---------------
  [ActionTypes.UpdateSurveyData](context: ActionAugments, value: SurveyModel): void;
  [ActionTypes.UpdateCurrentPageName](context: ActionAugments, value: string): void;
  [ActionTypes.UseSurveyJSON](context: ActionAugments, value: { surveyJSON: any; surveyModel: SurveyModel }): void;
  // Team Survey actions
  [ActionTypes.AddTeamSurvey](context: ActionAugments, value: { teamReportDataBundle: TeamReportDataBundle }): void;
  [ActionTypes.DeleteTeamSurvey](context: ActionAugments, value: string): void;
  [ActionTypes.ShowIndividualBreakdown](context: ActionAugments, value: string): void;
  [ActionTypes.HideIndividualBreakdown](context: ActionAugments): void;
};

export const actions: ActionTree<RootState, RootState> & Actions = {
  async [ActionTypes.GetLocalAppData]({ commit, getters }) {
    const thisAppData: SurveyModel = new SurveyModel(appData);
    commit(MutationType.SetSurveyModel, thisAppData);
    if (getters.returnSurveyModel !== undefined) {
      commit(MutationType.AppLoadingSuccess);
    } else {
      commit(MutationType.AppLoadingError);
    }
  },
  async [ActionTypes.SetAppData]({ commit, dispatch, getters }) {
    commit(MutationType.StartLoading);
    // Get local app data and define state.surveyModel
    dispatch(ActionTypes.GetLocalAppData);
    // If successfully loaded surveyModel, set all properties
    if (getters.isStateError === false) {
      let thisSurveyModel: SurveyModel = getters.returnSurveyModel;
      commit(MutationType.SetSurveyModel, thisSurveyModel);
      commit(MutationType.SetSectionsPrefix, appConfigSettings.sectionsPrefix);
      commit(MutationType.SetCurrentPageNo, thisSurveyModel.currentPageNo);
      commit(MutationType.SetCurrentPageName, '');
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
      commit(MutationType.Initialized);
    }
    commit(MutationType.StopLoading);
  },
  async [ActionTypes.SetSections]({ commit, getters }, value: SurveyModel) {
    let sections: Section[] = [];
    if (getters.returnSectionsNames.length > 0) {
      const sectionNames: string[] = getters.returnSectionsNames;
      sectionNames.forEach((sectionName) => {
        let newSection: Section = {
          sectionName: sectionName,
          enabled: false,
          completed: false,
          questionsNames: [],
          userScore: 0,
          maxScore: getters.returnSectionMaxScore(sectionName),
          questions: [],
        };
        value.getPageByName(sectionName).questions.forEach((question: any) => {
          newSection.questionsNames.push(question.name);
          newSection.questions.push(question);
        });
        sections.push(newSection);
      });
      commit(MutationType.SetSections, sections);
    }
  },
  async [ActionTypes.UpdateSectionScore]({ commit, getters }, value: PageModel) {
    let sectionScore: number = 0;
    let section: Section = getters.returnSectionByName(value.name);
    if (section !== undefined) {
      value.questions.forEach((question: any) => {
        if (question.value !== undefined) {
          const score = calcScore(question.getType(), question.value);
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
  async [ActionTypes.UpdateSurveyData]({ commit, dispatch, getters }, value: SurveyModel) {
    commit(MutationType.SetCurrentPageNo, value.currentPageNo);
    if (getters.returnRecommendations === undefined) {
      commit(MutationType.SetRecommendations, appConfig);
    }
    //Updating all sections instead as per current behavior
    let allPages: PageModel[] = value.pages;
    allPages.forEach((page) => {
      dispatch(ActionTypes.UpdateSectionScore, page);
    });
    commit(MutationType.SetToolData, value.data);
  },
  async [ActionTypes.UpdateCurrentPageName]({ commit }, value: string) {
    if (value.length > 0) {
      commit(MutationType.SetCurrentPageName, value);
    }
  },
  async [ActionTypes.UseSurveyJSON]({ commit, dispatch, getters }, { surveyJSON, surveyModel }) {
    commit(MutationType.SetSurveyJSON, surveyJSON);
    commit(MutationType.SetSurveyModel, surveyModel);
    const sectionsNames = getters.returnSectionsNamesGenerated;
    commit(MutationType.SetSectionsNames, sectionsNames);
    surveyModel.pages.forEach((page: any) => {
      dispatch(ActionTypes.UpdateSectionScore, page);
    });
    dispatch(ActionTypes.SetSections, surveyModel);
  },
  async [ActionTypes.AddTeamSurvey]({ commit }, { teamReportDataBundle }) {
    commit(MutationType.AddTeamSurvey, teamReportDataBundle);
  },
  async [ActionTypes.DeleteTeamSurvey]({ commit }, teamName) {
    commit(MutationType.DeleteTeamSurvey, teamName);
  },
  async [ActionTypes.ShowIndividualBreakdown]({ commit }, teamName) {
    commit(MutationType.ShowIndividualBreakdown, teamName);
  },
  async [ActionTypes.HideIndividualBreakdown]({ commit }) {
    commit(MutationType.HideIndividualBreakdown);
  },
};
