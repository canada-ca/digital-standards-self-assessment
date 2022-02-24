import { calcSectionMaxScore, getWeightBySectionAndQuestion } from '@/utils/utils';

const surveyJSON: any = {
  pages: [
    {
      name: 'section_one',
      title: {
        default: 'Empower staff to deliver better services',
        fr: 'Empower staff to deliver better services(FR)',
      },
      description: {
        default:
          'Make sure that staff have access to the tools, training and technologies they need. Empower the team to make decisions throughout the design, build and operation of the service.',
        fr: 'Make sure that staff have access to the tools, training and technologies they need. Empower the team to make decisions throughout the design, build and operation of the service.(FR)',
      },
      elements: [
        {
          type: 'rating',
          name: 's01q001',
          title: {
            default: "What is your team's process for making changes to a service?",
            fr: "What is your team's process for making changes to a service? (FR)",
          },
          isRequired: false,
          rateMax: 5,
          minRateDescription: {
            default: 'Strongly Disagree',
            fr: 'Strongly Disgree(FR)',
          },
          maxRateDescription: {
            default: 'Strongly Agree',
            fr: 'Strongly Agree(FR)',
          },
          weight: 2,
        },
        {
          type: 'boolean',
          name: 's01q002',
          title: {
            default: "Is senior management's approval required to make a routine change to your service?",
            fr: "Is senior management's approval required to make a routine change to your service? (FR)",
          },
          isRequired: false,
          defaultValue: false,
          labelTrue: {
            default: 'Yes',
            fr: 'Oui',
          },
          labelFalse: {
            default: 'No',
            fr: 'Non',
          },
        },
      ],
    },
    {
      name: 'section_two',
      title: {
        default: 'Use open standards and solutions',
        fr: 'Use open standards and solutions(FR)',
      },
      description: {
        default:
          'Leverage open standards and embrace leading practices, including the use of open source software where appropriate. Design for services and platforms that are seamless for Canadians to use no matter what device or channel they are using.',
        fr: 'Leverage open standards and embrace leading practices, including the use of open source software where appropriate. Design for services and platforms that are seamless for Canadians to use no matter what device or channel they are using.(FR)',
      },
      elements: [
        {
          type: 'boolean',
          name: 's02q01',
          title: {
            default:
              'Name examples of international, regional, or open standards or solutions, that your service has investigated during the development or design of your service?',
            fr: 'Name examples of international, regional, or open standards or solutions, that your service has investigated during the development or design of your service?(FR)',
          },
          isRequired: false,
          defaultValue: 'false',
          labelTrue: {
            default: 'Yes',
            fr: 'Oui',
          },
          labelFalse: {
            default: 'No',
            fr: 'Non',
          },
        },
        {
          type: 'boolean',
          name: 's02q02',
          title: {
            default:
              'Please give an example of an international, regional, or open standard or solution that was leveraged for the purposes of this service.',
            fr: 'Please give an example of an international, regional, or open standard or solution that was leveraged for the purposes of this service.(FR)',
          },
          isRequired: false,
          defaultValue: 'false',
          labelTrue: {
            default: 'Yes',
            fr: 'Oui',
          },
          labelFalse: {
            default: 'No',
            fr: 'Non',
          },
        },
      ],
    },
  ],
};
describe('Utils', () => {
  it('calcSectionMaxScore', () => {
    expect(calcSectionMaxScore('section_one', surveyJSON)).toEqual(15);
    expect(calcSectionMaxScore('section_two', surveyJSON)).toEqual(10);
  });

  it('getWeightBySectionAndQuestion', () => {
    expect(getWeightBySectionAndQuestion('section_one', 's01q001', surveyJSON)).toEqual(2);
    expect(getWeightBySectionAndQuestion('section_one', 's01q002', surveyJSON)).toEqual(1);
  });
});
