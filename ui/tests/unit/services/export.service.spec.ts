import {
  BilingualText,
  MultipleSelectQuestion,
  QuestionType,
  RatingQuestion,
  Section,
  SingleSelectQuestion,
  SurveyResult,
  Team,
  Survey,
} from '@/interfaces/api-models';
import exportService from '@/services/export.service';

import surveyJSON from './mock/survey.json';
import sectionGroups from './mock/section-groups.json';
import VueI18n, { IVueI18n } from 'vue-i18n';

describe('ExportService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('translate text', () => {
    const text: BilingualText = { default: 'English', fr: 'French' };
    expect(exportService.translateText('fr', text)).toEqual('French');
    expect(exportService.translateText('en', text)).toEqual('English');
  });

  it('get answer from rating type question', () => {
    const locale = 'en';
    const question: RatingQuestion = {
      name: 'q1',
      type: 'rating',
      title: {
        default: 'question 1',
        fr: 'question 1 fr',
      },
      value: '2',
      rateValues: [
        {
          value: '1',
          text: {
            default: 'answer1',
            fr: 'answer1 fr',
          },
        },
        {
          value: '2',
          text: {
            default: 'answer2',
            fr: 'answer2 fr',
          },
        },
        {
          value: '3',
          text: {
            default: 'answer3',
            fr: 'answer3 fr',
          },
        },
      ],
    };

    const result: SurveyResult = {
      answers: { q1: '2' },
      userId: '',
      team: '',
      survey: '',
      timeInThePosition: '',
    };

    expect(exportService.getAnswer(locale, question, result)).toEqual('answer2');
  });

  it('get answer from single selection type question', () => {
    const locale = 'en';
    const question: SingleSelectQuestion = {
      name: 'q1',
      type: 'radiogroup',
      title: {
        default: 'question 1',
        fr: 'question 1 fr',
      },
      value: '2',
      choices: [
        {
          value: '1',
          text: {
            default: 'answer1',
            fr: 'answer1 fr',
          },
        },
        {
          value: '2',
          text: {
            default: 'answer2',
            fr: 'answer2 fr',
          },
        },
        {
          value: '3',
          text: {
            default: 'answer3',
            fr: 'answer3 fr',
          },
        },
      ],
    };

    const result: SurveyResult = {
      answers: { q1: '2' },
      userId: '',
      team: '',
      survey: '',
      timeInThePosition: '',
    };

    expect(exportService.getAnswer(locale, question, result)).toEqual('answer2');
  });

  it('get answer from multiple selection type question', () => {
    const locale = 'en';
    const question: MultipleSelectQuestion = {
      name: 'q1',
      type: 'checkbox',
      title: {
        default: 'question 1',
        fr: 'question 1 fr',
      },
      value: ['1', '2'],
      choices: [
        {
          value: '1',
          text: {
            default: 'answer1',
            fr: 'answer1 fr',
          },
        },
        {
          value: '2',
          text: {
            default: 'answer2',
            fr: 'answer2 fr',
          },
        },
        {
          value: '3',
          text: {
            default: 'answer3',
            fr: 'answer3 fr',
          },
        },
      ],
    };

    const result: SurveyResult = {
      answers: { q1: ['1', '2'] },
      userId: '',
      team: '',
      survey: '',
      timeInThePosition: '',
    };

    expect(exportService.getAnswer(locale, question, result)).toEqual(['answer1', 'answer2']);
  });

  it('getSectionResults', () => {
    const q1: QuestionType = {
      name: 'q1',
      type: 'rating',
      title: {
        default: 'question 1',
        fr: 'question 1 fr',
      },
      value: '2',
      rateValues: [
        {
          value: '1',
          text: {
            default: 'answer1',
            fr: 'answer1 fr',
          },
        },
        {
          value: '2',
          text: {
            default: 'answer2',
            fr: 'answer2 fr',
          },
        },
        {
          value: '3',
          text: {
            default: 'answer3',
            fr: 'answer3 fr',
          },
        },
      ],
    };
    const q2: QuestionType = {
      name: 'q2',
      type: 'rating',
      title: {
        default: 'question 2',
        fr: 'question 2 fr',
      },
      value: '2',
      rateValues: [
        {
          value: '1',
          text: {
            default: 'answer1',
            fr: 'answer1 fr',
          },
        },
        {
          value: '2',
          text: {
            default: 'answer2',
            fr: 'answer2 fr',
          },
        },
        {
          value: '3',
          text: {
            default: 'answer3',
            fr: 'answer3 fr',
          },
        },
      ],
    };
    const data: { [key: string]: any } = {};
    const result: SurveyResult = {
      answers: { q1: '2', q2: '2' },
      userId: '',
      team: '',
      survey: '',
      timeInThePosition: '',
    };
    const section: Section = {
      name: 'section1',
      elements: [q1, q2],
    } as Section;
    exportService.getSectionResults('en', data, result, section);
    expect(data).toEqual({ 'question 1': 'answer2', 'question 2': 'answer2' });
  });

  it('convert answers to data array', () => {
    const team: Team = {
      teamId: 0,
      teamNameEn: 'Team1',
      teamNameFr: 'Team1 FR',
    };
    const results: SurveyResult[] = [
      {
        answers: {
          s01q001: '4',
          s02q001: '4',
          s03q001: '4',
          s04q001: '4',
          s05q001: '4',
          s06q001: '4',
        },
        userId: 'userId',
        team,
        survey: '',
        jobTitle: {
          gcitCode: 'GCIT040011',
          itLevel: 'IT-04',
          titleEn: 'IT Senior Advisor, IT Software Solutions',
          titleFr: 'Conseiller(-ère) principal(e) de la TI, Solutions logicielles de la TI',
          shortTitleEn: 'IT Senior Advisor, SS',
          shortTitleFr: 'Conseiller principal TI, SL',
        },
        timeInThePosition: 'lessThanAYear',
      },
    ];

    const i18n = {} as VueI18n & IVueI18n;
    i18n.t = (key: string) => {
      let result = '';
      switch (key) {
        case 'downloadUploadSurvey.team':
          result = 'Department';
          break;
        case 'downloadUploadSurvey.itLevel':
          result = 'IT Level';
          break;
        case 'downloadUploadSurvey.jobTitle':
          result = 'Job Title';
          break;
        case 'downloadUploadSurvey.timeInThePosition':
          result = 'Time in the position';
          break;
      }
      return result;
    };

    const data = exportService.convertToDataArray(i18n, sectionGroups, surveyJSON as Survey, results);

    expect(data).toEqual([
      {
        Department: 'Team1',
        'Time in the position': 'Less than a year',
        'IT Level': 'IT-04',
        'Job Title': 'IT Senior Advisor, IT Software Solutions',
        'Group 1': '',
        'Section A1': '',
        'Question 1': 'Always',
        'Section A2': '',
        'Question 2': 'Always',
        'Section A3': '',
        'Qeustion 3': 'Always',
        'Group 2': '',
        'Section B1': '',
        'Question 4': 'Always',
        'Section B2': '',
        'Question 5': 'Always',
        'Section B3': '',
        'Question 6': 'Always',
      },
    ]);
  });
});
