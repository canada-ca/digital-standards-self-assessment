import { Profile } from '@/interfaces/Profile';
import { mutations, MutationType } from '@/store/mutations';
import { Recommendations, RootState, Section } from '@/store/state';
import { SurveyModel } from 'survey-vue';

describe('mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('AppLoadingSuccess', () => {
    const state: RootState = {
      error: true,
    } as RootState;
    mutations[MutationType.AppLoadingSuccess](state);
    expect(state.error).toBeFalsy();
  });
  it('AppLoadingError', () => {
    const state: RootState = {
      error: false,
    } as RootState;
    mutations[MutationType.AppLoadingError](state);
    expect(state.error).toBeTruthy();
  });
  it('SetSurveyModel', () => {
    const state: RootState = {
      surveyModel: undefined,
    } as RootState;
    mutations[MutationType.SetSurveyModel](state, {} as SurveyModel);
    expect(state.surveyModel).toEqual({});
  });
  it('SetToolData', () => {
    const state: RootState = {
      toolData: undefined,
    } as RootState;
    mutations[MutationType.SetToolData](state, {});
    expect(state.toolData).toEqual({});
  });
  it('SetSectionsNames', () => {
    const state: RootState = {
      sectionsNames: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetSectionsNames](state, []);
    expect(state.sectionsNames).toEqual([]);
  });
  it('SetSections', () => {
    const state: RootState = {
      sections: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetSections](state, []);
    expect(state.sections).toEqual([]);
  });
  it('SetCurrentPageNo', () => {
    const state: RootState = {
      currentPageNo: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetCurrentPageNo](state, 10);
    expect(state.currentPageNo).toEqual(10);
  });
  it('SetCurrentPageName', () => {
    const state: RootState = {
      currentPageName: undefined,
    } as RootState;
    mutations[MutationType.SetCurrentPageName](state, 'page1');
    expect(state.currentPageName).toEqual('page1');
  });
  it('UpdateSection', () => {
    const state: RootState = {
      sections: [
        {
          sectionName: 'section1',
          enabled: true,
          completed: false,
          userScore: 0,
          maxScore: 20,
        },
      ],
    } as unknown as RootState;
    mutations[MutationType.UpdateSection](state, {
      sectionName: 'section1',
      enabled: true,
      completed: false,
      userScore: 20,
      maxScore: 20,
    } as Section);
    expect(state.sections).toEqual([
      {
        sectionName: 'section1',
        enabled: true,
        completed: false,
        userScore: 20,
        maxScore: 20,
      },
    ]);
  });
  it('SetRecommendations', () => {
    const state: RootState = {
      recommendations: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetRecommendations](state, {} as Recommendations);
    expect(state.recommendations).toEqual({});
  });
  it('SetToolVersion', () => {
    const state: RootState = {
      toolVersion: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetToolVersion](state, '1');
    expect(state.toolVersion).toEqual('1');
  });
  it('SetSectionsPrefix', () => {
    const state: RootState = {
      sectionsPrefix: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetSectionsPrefix](state, '___');
    expect(state.sectionsPrefix).toEqual('___');
  });
  it('StartLoading', () => {
    const state: RootState = {
      laoding: false,
    } as unknown as RootState;
    mutations[MutationType.StartLoading](state);
    expect(state.loading).toEqual(true);
  });
  it('StopLoading', () => {
    const state: RootState = {
      loading: true,
    } as unknown as RootState;
    mutations[MutationType.StopLoading](state);
    expect(state.loading).toEqual(false);
  });
  it('Initialized', () => {
    const state: RootState = {
      initialized: false,
    } as unknown as RootState;
    mutations[MutationType.Initialized](state);
    expect(state.initialized).toEqual(true);
  });
  it('SetSurveyJSON', () => {
    const state: RootState = {
      surveyJSON: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetSurveyJSON](state, {});
    expect(state.surveyJSON).toEqual({});
  });
  it('DeleteTeamSurvey', () => {
    const state: RootState = {
      teamReportDataBundleArray: [
        {
          teamId: 'team1',
        },
      ],
      teamAverageReportDataArray: [
        {
          teamId: 'team1',
        },
      ],
      individualTeam: {
        _id: 'team1',
      },
      showBreakdown: true,
      individualTeamReportDataArray: undefined,
    } as unknown as RootState;
    mutations[MutationType.DeleteTeamSurvey](state, 'team1');
    expect(state.teamReportDataBundleArray).toEqual([]);
    expect(state.teamAverageReportDataArray).toEqual([]);
    expect(state.individualTeam).toEqual(undefined);
    expect(state.showBreakdown).toBeFalsy();
    expect(state.individualTeamReportDataArray).toEqual([]);
  });
  it('SetTeamSurveys', () => {
    const state: RootState = {
      teamReportDataBundleArray: undefined,
      teamAverageReportDataArray: undefined,
    } as unknown as RootState;
    mutations[MutationType.SetTeamSurveys](state, []);
    expect(state.teamReportDataBundleArray).toEqual([]);
    expect(state.teamAverageReportDataArray).toEqual([]);
  });
  it('ShowIndividualBreakdown', () => {
    const state: RootState = {
      teamReportDataBundleArray: [
        {
          teamId: 'team1',
          team: {},
          userReportDataArray: [1],
        },
      ],
      individualTeam: undefined,
      individualTeamReportDataArray: undefined,
      showBreakdown: false,
    } as unknown as RootState;
    mutations[MutationType.ShowIndividualBreakdown](state, 'team1');
    expect(state.individualTeam).toEqual({});
    expect(state.individualTeamReportDataArray).toEqual([1]);
    expect(state.showBreakdown).toEqual(true);
  });
  it('HideIndividualBreakdown', () => {
    const state: RootState = {
      individualTeam: {},
      individualTeamReportDataArray: [1],
      showBreakdown: true,
    } as unknown as RootState;
    mutations[MutationType.HideIndividualBreakdown](state);
    expect(state.individualTeam).toEqual(undefined);
    expect(state.individualTeamReportDataArray).toEqual([]);
    expect(state.showBreakdown).toEqual(false);
  });
  it('SaveProfile', () => {
    const state: RootState = {
      profile: undefined,
    } as unknown as RootState;
    mutations[MutationType.SaveProfile](state, {} as Profile);
    expect(state.profile).toEqual({});
  });
  it('ShowHideProfile', () => {
    const state: RootState = {
      showProfile: undefined,
    } as unknown as RootState;
    mutations[MutationType.ShowHideProfile](state, true);
    expect(state.showProfile).toEqual(true);
  });
  it('ResetSectionScores', () => {
    const state: RootState = {
      toolData: { q1: 10 },
      sections: [
        {
          sectionName: 'section1',
          enabled: true,
          completed: false,
          userScore: 20,
          maxScore: 20,
        },
      ],
    } as unknown as RootState;
    mutations[MutationType.ResetSectionScores](state);
    expect(state.toolData).toEqual({});
    expect(state.sections).toEqual([
      {
        sectionName: 'section1',
        enabled: true,
        completed: false,
        userScore: 0,
        maxScore: 20,
      },
    ]);
  });
});
