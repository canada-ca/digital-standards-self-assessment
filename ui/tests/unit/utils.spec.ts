import { calcSectionMaxScore } from '@/utils/utils';

const surveyJSON: any = {
  pages: [
    {
      name: 'section_one',
      title: {
        default: 'Test section',
        fr: 'Test section(FR)',
      },
      elements: [
        {
          type: 'radiogroup',
          name: 'question1',
          title: {
            default: 'Question',
            fr: 'Question(FR)',
          },
          choices: [
            {
              value: '1',
              text: {
                default: 'Item 1',
                fr: 'Item 1 (FR)',
              },
            },
            {
              value: '2',
              text: {
                default: 'Item 2',
                fr: 'Item 2 (FR)',
              },
            },
            {
              value: '3',
              text: {
                default: 'Item 3',
                fr: 'Item 3 (FR)',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          name: 'question2',
          title: {
            fr: 'question2(FR)',
          },
          choices: [
            {
              value: '1',
              text: {
                default: 'Item 1',
                fr: 'Item 1 (FR)',
              },
            },
            {
              value: '2',
              text: {
                default: 'Item 2',
                fr: 'Item 2 (FR)',
              },
            },
            {
              value: '3',
              text: {
                default: 'Item 3',
                fr: 'Item 3 (FR)',
              },
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'question3',
          title: {
            fr: 'question3(FR)',
          },
          choices: [
            {
              value: '1',
              text: {
                default: 'item1',
                fr: 'Item1 (FR)',
              },
            },
            {
              value: '2',
              text: {
                default: 'item2',
                fr: 'Item2 (FR)',
              },
            },
            {
              value: '3',
              text: {
                default: 'item3',
                fr: 'Item3 (FR)',
              },
            },
          ],
        },
        {
          type: 'boolean',
          name: 'test',
          title: {
            default: 'test boolean question',
            fr: 'test boolean question(FR)',
          },
          labelTrue: {
            default: 'Yes',
            fr: 'Oui',
          },
          labelFalse: {
            default: 'No',
            fr: 'Non',
          },
          valueTrue: '4',
          valueFalse: '0',
        },
      ],
    },
  ],
};
describe('Utils', () => {
  it('calcSectionMaxScore', () => {
    expect(calcSectionMaxScore('section_one', surveyJSON)).toEqual(16);
  });
});
