import { ActionTypes } from '@/store/actions';
import Survey from '@/views/Survey.vue';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

describe('Survey View', () => {
  let getters: any;
  let $store: any;
  let mocks: any;
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    getters = {
      returnToolData: () => ({}),
      returnSurveyJSON: () => ({ _id: 'surveyId' }),
    };

    $store = {
      getters,
      commit: jest.fn(),
      dispatch: jest.fn(),
    };

    mocks = { $t: jest.fn(), $store, apiService: { saveSurveyResult: jest.fn() } };
  });

  it('should render', () => {
    const wrapper = shallowMount(Survey, { mocks, localVue });
    expect(wrapper.html()).toBe(`<div class=\"container\">
  <message-stub></message-stub>
  <div>
    <surveysectionscontainer-stub sectiongroups="" sections=\"\" survey=\"[object Object]\"></surveysectionscontainer-stub>
  </div>
  <div class=\"btn-div\">
    <b-button-stub tag="button" target="_self" type="button" variant="secondary" class=\"btn btn-secondary reset\"></b-button-stub>
    <!---->
    <b-button-stub tag="button" target="_self" type="button" variant="secondary" class=\"btn btn-primary submitAnswers\"></b-button-stub>
  </div>
</div>`);
  });

  it('reset', async () => {
    const wrapper = mount(Survey, { mocks, localVue });
    await wrapper.find('.reset').trigger('click');
    expect($store.dispatch).toBeCalledTimes(2);
    expect($store.dispatch).toHaveBeenLastCalledWith(ActionTypes.Reset);
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    it('should show profile intput when profile is not set', async () => {
      getters = { ...getters, returnProfile: () => null };
      window.scrollTo = jest.fn();
      const wrapper = mount(Survey, { mocks, localVue });
      await wrapper.find('.submitAnswers').trigger('click');
      expect($store.dispatch).toBeCalledTimes(1);
      expect($store.dispatch).toHaveBeenLastCalledWith(ActionTypes.ShowHideProfile, true);
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('should show success message', async () => {
      getters = { ...getters, returnProfile: () => ({ email: 'email', team: 'team1' }) };
      window.scrollTo = jest.fn();

      const wrapper = mount(Survey, { mocks, localVue });
      await wrapper.find('.submitAnswers').trigger('click');
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});
