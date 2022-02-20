import { Actions, actions } from '@/store/actions';
import { Getters, getters } from '@/store/getters';
import { Mutations, mutations } from '@/store/mutations';
import { RootState, state } from '@/store/state';
import Vue from 'vue';
import Vuex, { CommitOptions, DispatchOptions, Store as VuexStore, StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    currentPageNo: state.currentPageNo,
    currentPageName: state.currentPageName,
    surveyJSON: state.surveyJSON,
    teamReportDataBundleArray: state.teamReportDataBundleArray,
    teamAverageReportDataArray: state.teamAverageReportDataArray,
    individualTeamReportDataArray: state.individualTeamReportDataArray,
  }),
});

export const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state,
  mutations,
  actions,
  getters,
};

export default new Vuex.Store<RootState>(store);

export type Store = Omit<VuexStore<RootState>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: { [K in keyof Getters]: ReturnType<Getters[K]> };
};
