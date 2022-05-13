import { getters } from '@/store/getters';
import { RootState } from '@/store/state';
import { SurveyModel } from 'survey-vue';

describe('getters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('isStateError', () => {
    const state: RootState = {
      error: true,
    } as RootState;
    expect(getters.isStateError(state)).toEqual(true);
  });
  it('inProgress', () => {
    const state: RootState = {
      toolData: { fff: 10 },
    } as RootState;
    expect(getters.inProgress(state)).toEqual(true);
    state.toolData = {};
    expect(getters.inProgress(state)).toEqual(false);
    state.toolData = undefined;
    expect(getters.inProgress(state)).toEqual(false);
    state.toolData = null;
    expect(getters.inProgress(state)).toEqual(false);
  });
  it('isInitialized', () => {
    const state: RootState = {
      initialized: true,
    } as RootState;
    expect(getters.isInitialized(state)).toEqual(true);
  });
  it('returnSectionsNames', () => {
    const state: RootState = {
      sectionsNames: [],
    } as unknown as RootState;
    expect(getters.returnSectionsNames(state)).toEqual([]);
  });
  it('returnSectionByName', () => {
    const state: RootState = {
      sections: [
        {
          sectionName: 'section1',
          maxScore: 20,
          userScore: 10,
        },
      ],
    } as RootState;
    expect(getters.returnSectionByName(state)('section1')).toEqual({
      sectionName: 'section1',
      maxScore: 20,
      userScore: 10,
    });
    expect(getters.returnSectionByName(state)('section2')).toEqual(undefined);
  });
  it('returnRecommendations', () => {
    const state: RootState = {
      recommendations: [],
    } as unknown as RootState;
    expect(getters.returnRecommendations(state)).toEqual([]);
  });
  it('returnSectionsByPrefix', () => {
    let survenModel = { pages: [] } as SurveyModel;
    const state: RootState = {
      recommendations: [],
    } as unknown as RootState;
    expect(getters.returnSectionsByPrefix(state)(survenModel, 'section_')).toEqual([]);
    survenModel = {
      pages: [
        {
          name: 'section_1',
        },
        {
          name: 'section_2',
        },
        {
          name: 'others',
        },
      ],
    } as SurveyModel;
    expect(getters.returnSectionsByPrefix(state)(survenModel, 'section_')).toEqual([
      {
        name: 'section_1',
      },
      {
        name: 'section_2',
      },
    ]);
  });

  it('returnCurrentSection', () => {
    let state: RootState = {
      sections: [
        {
          sectionName: 'section1',
          maxScore: 20,
          userScore: 10,
        },
      ],
      currentPageName: 'section1',
    } as unknown as RootState;
    expect(getters.returnCurrentSection(state)).toEqual({
      sectionName: 'section1',
      maxScore: 20,
      userScore: 10,
    });

    state.currentPageName = undefined;
    expect(getters.returnCurrentSection(state)).toEqual(undefined);
    state.currentPageName = 'others';
    expect(getters.returnCurrentSection(state)).toEqual(undefined);
  });

  it('returnToolData', () => {
    const state: RootState = {
      toolData: undefined,
    } as unknown as RootState;
    expect(getters.returnToolData(state)).toEqual({});
    state.toolData = { q1: 20 };
    expect(getters.returnToolData(state)).toEqual({ q1: 20 });
  });

  it('returnSectionsNamesGenerated', () => {
    const state: RootState = {
      surveyModel: undefined,
      sectionsPrefix: 'section_',
    } as unknown as RootState;
    expect(getters.returnSectionsNamesGenerated(state)).toEqual([]);
    state.surveyModel = {
      pages: [
        {
          name: 'section_1',
        },
        {
          name: 'section_2',
        },
        {
          name: 'others',
        },
      ],
    } as SurveyModel;
    expect(getters.returnSectionsNamesGenerated(state)).toEqual(['section_1', 'section_2']);
  });

  it('determineAllSections', () => {
    const state: RootState = {
      surveyModel: undefined,
    } as unknown as RootState;
    expect(getters.determineAllSections(state, 'section_')).toEqual([]);
    state.surveyModel = {
      pages: [
        {
          name: 'section_1',
        },
        {
          name: 'section_2',
        },
        {
          name: 'others',
        },
      ],
    } as SurveyModel;
    expect(getters.determineAllSections(state, 'section_')).toEqual(['section_1', 'section_2']);
  });
});
