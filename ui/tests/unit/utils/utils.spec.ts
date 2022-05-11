import { calcScore, calcSectionMaxScore, validateEmail } from '@/utils/utils';

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
          type: 'rating',
          name: 'question0',
          title: {
            default:
              'Our team has frameworks and processes supporting the ethical collection, management, sharing, and use of data.',
            fr: "Notre équipe a des cadres et des processus servant à soutenir la collecte, la gestion, la communication et l'usage éthiques des données.",
          },
          rateValues: [
            {
              value: '0',
              text: {
                default: 'Never',
                fr: 'Jamais',
              },
            },
            {
              value: '1',
              text: {
                default: 'Rarely',
                fr: 'Rarement',
              },
            },
            {
              value: '2',
              text: {
                default: 'Not sure',
                fr: 'Ne sais pas',
              },
            },
            {
              value: '3',
              text: {
                default: 'Sometimes',
                fr: 'Parfois',
              },
            },
            {
              value: '4',
              text: {
                default: 'Always',
                fr: 'Toujours',
              },
            },
          ],
        },
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
            {
              value: '2',
              text: {
                default: 'Item 4',
                fr: 'Item 4 (FR)',
              },
            },
            {
              value: '1',
              text: {
                default: 'Item 5',
                fr: 'Item 5 (FR)',
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
          name: 'question4',
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
        {
          type: 'boolean',
          name: 'question5',
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
          valueTrue: '0',
          valueFalse: '5',
        },
      ],
    },
  ],
};
describe('Utils', () => {
  it('calcSectionMaxScore', () => {
    expect(calcSectionMaxScore('section_one', surveyJSON)).toEqual(25);
    expect(calcSectionMaxScore('section_one', undefined)).toEqual(0);
    expect(calcSectionMaxScore('section_one', {})).toEqual(0);
  });

  it('calcScore', () => {
    expect(calcScore(undefined)).toEqual(0);
    expect(calcScore(null)).toEqual(0);
    expect(calcScore(10)).toEqual(10);
    expect(calcScore([1, 2, 3])).toEqual(6);
  });

  it('validateEmail', () => {
    expect(validateEmail('abc@sss.com')).toBeTruthy();
    expect(validateEmail('abcsss.com')).toBeFalsy();
    expect(validateEmail('ab@c@sss.com')).toBeFalsy();
    expect(validateEmail('abb@sdfsdfsdf')).toBeFalsy();
    expect(validateEmail('111@')).toBeFalsy();
    expect(validateEmail('@asdfasf.com')).toBeFalsy();
  });
});
