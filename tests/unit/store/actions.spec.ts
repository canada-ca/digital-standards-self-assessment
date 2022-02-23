import { ActionAugments, actions, ActionTypes } from '@/store/actions';
import { Mutations, MutationType } from '@/store/mutations';

describe('actions', () => {
  describe('HideIndividualBreakdown', () => {
    it('should commit MutationType.HideIndividualBreakdown', () => {
      const mockContext: ActionAugments = {
        commit: <K extends MutationType>(key: K, payload?: Parameters<Mutations[K]>[1]): void => {
          expect(key).toEqual(MutationType.HideIndividualBreakdown);
        },
      } as ActionAugments;
      actions[ActionTypes.HideIndividualBreakdown](mockContext);
    });
  });
});
