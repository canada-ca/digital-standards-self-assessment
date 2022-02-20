import { mutations, MutationType } from '@/store/mutations';
import { RootState, TeamReportData, TeamReportDataBundle } from '@/store/state';

describe('Mutations', () => {
  describe('AddTeamSurvey', () => {
    it('should add a new team survey', () => {
      // mock store
      const state: RootState = {
        teamReportDataBundleArray: [] as TeamReportDataBundle[],
        teamAverageReportDataArray: [] as TeamReportData[],
      } as RootState;
      const payload: TeamReportDataBundle = {
        teamName: 'team1',
        teamAverageReportData: {} as TeamReportData,
        teamReportDataArray: [],
      };
      mutations[MutationType.AddTeamSurvey](state, payload);
      expect(state.teamReportDataBundleArray.length).toEqual(1);
      expect(state.teamReportDataBundleArray[0].teamName).toEqual('team1');
      expect(state.teamAverageReportDataArray.length).toEqual(1);
    });

    it('should replace the existing team survey', () => {
      // mock store
      const state: RootState = {
        teamReportDataBundleArray: [
          {
            teamName: 'team1',
            teamAverageReportData: { name: 'team1' } as TeamReportData,
            teamReportDataArray: [{ name: 'team1' } as TeamReportData],
          },
        ] as TeamReportDataBundle[],
        teamAverageReportDataArray: [
          {
            name: 'team1',
            sections: [],
          },
        ] as TeamReportData[],
      } as RootState;
      const payload: TeamReportDataBundle = {
        teamName: 'team1',
        teamAverageReportData: { name: 'team1' } as TeamReportData,
        teamReportDataArray: [{ name: 'team1' } as TeamReportData],
      };
      expect(state.teamReportDataBundleArray.length).toEqual(1);
      expect(state.teamAverageReportDataArray.length).toEqual(1);
      mutations[MutationType.AddTeamSurvey](state, payload);
      expect(state.teamReportDataBundleArray.length).toEqual(1);
      expect(state.teamAverageReportDataArray.length).toEqual(1);
    });
  });

  describe('DeleteTeamSurvey', () => {
    it('should delete a team survey', () => {
      // mock store
      const state: RootState = {
        individualTeamName: 'team1',
        individualTeamReportDataArray: [{}],
        showBreakdown: true,
        teamReportDataBundleArray: [
          {
            teamName: 'team1',
            teamAverageReportData: { name: 'team1' } as TeamReportData,
            teamReportDataArray: [{ name: 'team1' } as TeamReportData],
          },
        ] as TeamReportDataBundle[],
        teamAverageReportDataArray: [
          {
            name: 'team1',
            sections: [],
          },
        ] as TeamReportData[],
      } as RootState;

      mutations[MutationType.DeleteTeamSurvey](state, 'team1');

      expect(state.teamAverageReportDataArray.length).toEqual(0);
      expect(state.teamReportDataBundleArray.length).toEqual(0);
      expect(state.individualTeamName).toEqual('');
      expect(state.individualTeamReportDataArray).toEqual([]);
      expect(state.showBreakdown).toBeFalsy();
    });
  });

  describe('ShowIndividualBreakdown', () => {
    it('should set showBreakdown to false', () => {
      const state: RootState = {
        individualTeamName: 'team1',
        individualTeamReportDataArray: [{}],
        showBreakdown: true,
      } as RootState;

      mutations[MutationType.HideIndividualBreakdown](state);
      expect(state.individualTeamName).toEqual('');
      expect(state.individualTeamReportDataArray).toEqual([]);
      expect(state.showBreakdown).toBeFalsy();
    });
    it('should set showBreakdown to true', () => {
      const state: RootState = {
        individualTeamName: '',
        individualTeamReportDataArray: [] as TeamReportData[],
        showBreakdown: false,
        teamReportDataBundleArray: [
          {
            teamName: 'team1',
            teamAverageReportData: { name: 'team1' } as TeamReportData,
            teamReportDataArray: [{ name: 'team1' } as TeamReportData],
          },
        ] as TeamReportDataBundle[],
      } as RootState;

      mutations[MutationType.ShowIndividualBreakdown](state, 'team1');
      expect(state.individualTeamName).toEqual('team1');
      expect(state.individualTeamReportDataArray.length).toEqual(1);
      expect(state.showBreakdown).toBeTruthy();
    });
  });
});
