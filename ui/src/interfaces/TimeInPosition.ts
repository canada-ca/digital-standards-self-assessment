export interface TimeInPosition {
  value: string;
  titleEn: string;
  titleFr: string;
}

export const allTimePositions: TimeInPosition[] = [
  {
    value: 'lessThanAYear',
    titleEn: 'Less than a year',
    titleFr: "Moins d'un an",
  },
  {
    value: 'oneYearOrMore',
    titleEn: 'One year or more',
    titleFr: 'Un an et plus',
  },
];
