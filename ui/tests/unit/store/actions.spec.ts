import { ActionAugments, actions, ActionTypes } from '@/store/actions';
import { Mutations, MutationType } from '@/store/mutations';

describe('actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('SetAppData', () => {
    it('should ', async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const getters = {
        isStateError: false,
      };
      const mockContext = {
        commit,
        dispatch,
        getters: {
          isStateError: false,
        },
      } as unknown as ActionAugments;
      actions[ActionTypes.SetAppData](mockContext);
    });
  });

  it('HideIndividualBreakdown', () => {
    const mockContext: ActionAugments = {
      commit: <K extends MutationType>(key: K, payload?: Parameters<Mutations[K]>[1]): void => {
        expect(key).toEqual(MutationType.HideIndividualBreakdown);
      },
    } as ActionAugments;
    actions[ActionTypes.HideIndividualBreakdown](mockContext);
  });

  it('ShowIndividualBreakdown', () => {
    const commit = jest.fn();
    const mockContext = {
      commit,
    } as unknown as ActionAugments;
    actions[ActionTypes.ShowIndividualBreakdown](mockContext, 'team1');
    expect(commit).toHaveBeenLastCalledWith(MutationType.ShowIndividualBreakdown, 'team1');
  });
});
