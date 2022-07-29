import { RatingQuestion, SectionGroup, Survey } from '@/interfaces/api-models';
import { Profile } from '@/interfaces/Profile';
import apiService from '@/services/api.service';
import { ActionAugments, actions, ActionTypes } from '@/store/actions';
import { Mutations, MutationType } from '@/store/mutations';
import { Section, TeamReportDataBundle } from '@/store/state';
import { PageModel, SurveyModel } from 'survey-vue';

describe('actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('SetAppData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should commit SetSectionsNames when sectionsNames is empty ', async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const getters = {
        returnSurveyModel: { currentPageNo: 0 },
        isStateError: false,
        returnSectionsNames: [],
        returnSections: [],
        returnSectionsNamesGenerated: ['name1', 'name2'],
      };
      const mockContext = {
        commit,
        dispatch,
        getters,
      } as unknown as ActionAugments;
      await actions[ActionTypes.SetAppData](mockContext);
      expect(commit).toHaveBeenCalledTimes(11);
      expect(commit).toHaveBeenNthCalledWith(7, MutationType.SetSectionsNames, ['name1', 'name2']);
    });

    describe('SetAppData', () => {
      it('should dispatch SetSections when returnSections is empty ', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const getters = {
          returnSurveyModel: { currentPageNo: 0 },
          isStateError: false,
          returnSectionsNames: [],
          returnSections: [],
          returnSectionsNamesGenerated: ['name1', 'name2'],
        };
        const mockContext = {
          commit,
          dispatch,
          getters,
        } as unknown as ActionAugments;
        await actions[ActionTypes.SetAppData](mockContext);
        expect(dispatch).toHaveBeenNthCalledWith(2, ActionTypes.SetSections, { currentPageNo: 0 });
      });
    });
  });

  describe('GetLocalAppData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.spyOn(apiService, 'findLatestSurvey').mockReturnValue(Promise.resolve({} as Survey));
      jest.spyOn(apiService, 'findSectionGroups').mockReturnValue(Promise.resolve([] as SectionGroup[]));
    });

    it('should commit AppLoadingError when returnSurveyModel is empty', async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const getters = {
        returnSurveyModel: undefined,
      };
      const mockContext = {
        commit,
        dispatch,
        getters,
      } as unknown as ActionAugments;
      await actions[ActionTypes.GetLocalAppData](mockContext);
      expect(apiService.findLatestSurvey).toHaveBeenCalledTimes(1);
      expect(apiService.findSectionGroups).toHaveBeenCalled();
      expect(commit).toBeCalledTimes(4);
      expect(commit).toHaveBeenNthCalledWith(4, MutationType.AppLoadingError);
    });
    it('should commit AppLoadingSuceess when returnSurveyModel is not empty', async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const getters = {
        returnSurveyModel: { currentPageNo: 0 },
      };
      const mockContext = {
        commit,
        dispatch,
        getters,
      } as unknown as ActionAugments;
      await actions[ActionTypes.GetLocalAppData](mockContext);
      expect(apiService.findLatestSurvey).toHaveBeenCalledTimes(1);
      expect(apiService.findSectionGroups).toHaveBeenCalled();
      expect(commit).toBeCalledTimes(4);
      expect(commit).toHaveBeenNthCalledWith(4, MutationType.AppLoadingSuccess);
    });
  });

  it('SetSections', async () => {
    const survey = new SurveyModel();
    jest
      .spyOn(survey, 'getPageByName')
      .mockReturnValue({ questions: [{ name: 'q1' }, { name: 'q2' }, { name: 'q3' }] } as PageModel);
    const commit = jest.fn();
    const dispatch = jest.fn();
    const getters = {
      returnSectionsNames: ['1', '2', '3'],
      returnSectionMaxScore: () => 10,
    };
    const mockContext = {
      commit,
      dispatch,
      getters,
    } as unknown as ActionAugments;
    await actions[ActionTypes.SetSections](mockContext, survey);
    expect(commit).toHaveBeenCalledWith(MutationType.SetSections, [
      {
        completed: false,
        enabled: false,
        maxScore: 10,
        questions: [{ name: 'q1' }, { name: 'q2' }, { name: 'q3' }],
        questionsNames: ['q1', 'q2', 'q3'],
        sectionName: '1',
        userScore: 0,
      },
      {
        completed: false,
        enabled: false,
        maxScore: 10,
        questions: [{ name: 'q1' }, { name: 'q2' }, { name: 'q3' }],
        questionsNames: ['q1', 'q2', 'q3'],
        sectionName: '2',
        userScore: 0,
      },
      {
        completed: false,
        enabled: false,
        maxScore: 10,
        questions: [{ name: 'q1' }, { name: 'q2' }, { name: 'q3' }],
        questionsNames: ['q1', 'q2', 'q3'],
        sectionName: '3',
        userScore: 0,
      },
    ]);
  });
  describe('UpdateSectionScore', () => {
    it('should update section score', async () => {
      const commit = jest.fn();
      const section: Section = {
        sectionName: 'section',
        userScore: 0,
      } as Section;
      const getters = {
        returnSectionByName: () => section,
      };
      const pageModel: PageModel = {
        questions: [{ value: 10 }],
      } as PageModel;
      const mockContext = {
        commit,
        getters,
      } as unknown as ActionAugments;

      await actions[ActionTypes.UpdateSectionScore](mockContext, pageModel);
      expect(commit).toHaveBeenCalledWith(MutationType.UpdateSection, { ...section, userScore: 10 });
    });

    it("should not update section score when can't find the section name", async () => {
      const commit = jest.fn();
      const section: Section = {
        sectionName: 'section',
        userScore: 0,
      } as Section;
      const getters = {
        returnSectionByName: () => undefined,
      };
      const pageModel: PageModel = {
        questions: [{ value: 10 }],
      } as PageModel;
      const mockContext = {
        commit,
        getters,
      } as unknown as ActionAugments;

      await actions[ActionTypes.UpdateSectionScore](mockContext, pageModel);
      expect(commit).toHaveBeenCalledTimes(0);
    });
  });

  it('UpdateSurveyData', async () => {
    const surveyModel: SurveyModel = {
      pages: [
        {
          questions: [{ value: 10 }],
        } as PageModel,
        {
          questions: [{ value: 20 }],
        } as PageModel,
      ],
      data: { q1: '11', q2: '22' },
    } as SurveyModel;
    const commit = jest.fn();
    const dispatch = jest.fn();
    const getters = {};
    const mockContext = {
      commit,
      dispatch,
      getters,
    } as unknown as ActionAugments;
    await actions[ActionTypes.UpdateSurveyData](mockContext, surveyModel);
    expect(dispatch).toHaveReturnedTimes(2);
    expect(commit).toHaveBeenCalledWith(MutationType.SetToolData, { q1: '11', q2: '22' });
  });

  it('UpdateCurrentPageName', async () => {
    const pageName = 'page1';
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    await actions[ActionTypes.UpdateCurrentPageName](mockContext, pageName);
    expect(commit).toHaveBeenCalledWith(MutationType.SetCurrentPageName, pageName);
    jest.resetAllMocks();
    await actions[ActionTypes.UpdateCurrentPageName](mockContext, '');
    expect(commit).toHaveBeenCalledTimes(0);
  });

  it('UseSurveyJSON', async () => {
    const surveyJSON = {};
    const surveyModel: SurveyModel = {
      pages: [
        {
          questions: [{ value: 10 }],
        } as PageModel,
        {
          questions: [{ value: 20 }],
        } as PageModel,
      ],
      data: { q1: '11', q2: '22' },
    } as SurveyModel;
    const commit = jest.fn();
    const dispatch = jest.fn();
    const getters = {
      returnSectionsNamesGenerated: [],
    };
    const mockContext = {
      commit,
      dispatch,
      getters,
    } as unknown as ActionAugments;
    await actions[ActionTypes.UseSurveyJSON](mockContext, { surveyModel, surveyJSON });
    expect(commit).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it('DeleteTeamSurvey', async () => {
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    await actions[ActionTypes.DeleteTeamSurvey](mockContext, 'teamName');
    expect(commit).toHaveBeenCalledWith(MutationType.DeleteTeamSurvey, 'teamName');
  });

  it('SetTeamSurveys', async () => {
    const teamReportDataBundleArray = [] as TeamReportDataBundle[];
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    await actions[ActionTypes.SetTeamSurveys](mockContext, teamReportDataBundleArray);
    expect(commit).toHaveBeenCalledWith(MutationType.SetTeamSurveys, teamReportDataBundleArray);
  });

  describe('ShowHideIndividualBreakdown', () => {
    it('Should HideIndividualBreakdown', () => {
      const mockContext: ActionAugments = {
        commit: <K extends MutationType>(key: K, payload?: Parameters<Mutations[K]>[1]): void => {
          expect(key).toEqual(MutationType.HideIndividualBreakdown);
        },
      } as ActionAugments;
      actions[ActionTypes.HideIndividualBreakdown](mockContext);
    });

    it('Should ShowIndividualBreakdown', async () => {
      const commit = jest.fn();
      const mockContext = {
        commit,
      } as unknown as ActionAugments;
      await actions[ActionTypes.ShowIndividualBreakdown](mockContext, 'team1');
      expect(commit).toHaveBeenLastCalledWith(MutationType.ShowIndividualBreakdown, 'team1');
    });
  });

  it('SaveProfile', async () => {
    const profile: Profile = {} as Profile;
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    await actions[ActionTypes.SaveProfile](mockContext, profile);
    expect(commit).toHaveBeenLastCalledWith(MutationType.SaveProfile, profile);
  });
  it('ShowHideProfile', async () => {
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    await actions[ActionTypes.ShowHideProfile](mockContext, true);
    expect(commit).toHaveBeenLastCalledWith(MutationType.ShowHideProfile, true);
  });
  it('Reset', async () => {
    const commit = jest.fn();
    const dispatch = jest.fn();
    const mockContext = {
      getters: {
        isInitialized: true,
      },
      commit,
      dispatch,
    } as unknown as ActionAugments;
    await actions[ActionTypes.Reset](mockContext);
    expect(dispatch).toHaveBeenCalledWith(ActionTypes.SetAppData);
    expect(commit).toHaveBeenLastCalledWith(MutationType.ResetSectionScores);
  });
});
