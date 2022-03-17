export const calcScore = (questionType: string, value: any): number => {
  let score = 0;
  if (value !== undefined) {
    if (value instanceof Array) {
      score = value.reduce((prev: number, cur: any) => {
        return prev + +cur;
      }, 0);
    } else {
      score = +value;
    }
  }
  return score;
};

export const calcSectionMaxScore = (sectionName: string, surveyJSON: any) => {
  if (surveyJSON && surveyJSON.pages) {
    const section = surveyJSON.pages.find((s: any) => s.name === sectionName);
    if (section) {
      return section.elements.reduce((prev: number, cur: any) => {
        let curMax = 0;
        if (cur.type === 'rating') {
          curMax = cur.rateValues.reduce((prev: number, value: any) => {
            const curValue = +value.value;
            return prev < curValue ? curValue : prev;
          }, 0);
        } else if (cur.type === 'boolean') {
          curMax = +cur.valueFalse < +cur.valueTrue ? +cur.valueTrue : +cur.valueFalse;
        } else if (cur.type === 'radiogroup' || cur.type === 'dropdown') {
          curMax = cur.choices.reduce((prev: number, value: any) => {
            const curValue = +value.value;
            return prev < curValue ? curValue : prev;
          }, 0);
        } else if (cur.type === 'checkbox') {
          curMax = cur.choices.reduce((prev: number, value: any) => {
            const curValue = +value.value;
            return prev + curValue;
          }, 0);
        }
        return prev + curMax;
      }, 0);
    }
  }
  return 0;
};
