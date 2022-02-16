export const calcSectionMaxScore = (sectionName: string, surveyJSON: any) => {
  const section = surveyJSON.pages.find((s: any) => s.name === sectionName);
  if (section) {
    return section.elements.reduce((prev: number, cur: any) => {
      const weight = cur.weight || 1;
      return prev + 5 * weight;
    }, 0);
  }
  return 0;
};

export const getWeightBySectionAndQuestion = (sectionName: string, questionName: string, surveyJSON: any) => {
  const section = surveyJSON.pages.find((s: any) => s.name === sectionName);
  if (section) {
    const question = section.elements.find((e: any) => e.name === questionName);
    if (question && question.weight) {
      return question.weight;
    }
  }
  return 1;
};
