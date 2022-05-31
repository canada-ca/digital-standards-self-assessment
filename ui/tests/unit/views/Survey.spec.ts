import Survey from '@/views/Survey.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Survey View', () => {
  let getters;
  let store: any;
  let mocks: any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    mocks = { $t: jest.fn() };
    getters = {
      returnSurveyJSON: () => {},
    };
    store = new Vuex.Store({ getters });
  });

  it('should render', () => {
    const wrapper = shallowMount(Survey, { mocks, stubs: { 'b-button': true }, store, localVue });
    expect(wrapper.html()).toBe(`<div class=\"container\">
  <message-stub></message-stub>
  <div>
    <surveysectionscontainer-stub sections=\"\" survey=\"[object Object]\"></surveysectionscontainer-stub>
  </div>
  <div class=\"btn-div\">
    <b-button-stub class=\"btn btn-secondary\"></b-button-stub>
    <download-survey-stub></download-survey-stub>
    <b-button-stub class=\"btn btn-primary\"></b-button-stub>
  </div>
</div>`);
  });
});
