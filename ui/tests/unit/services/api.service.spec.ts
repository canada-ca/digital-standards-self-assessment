import { SurveyResult } from '@/interfaces/api-models';
import apiService from '@/services/api.service';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
process.env.VUE_APP_API_BASE_URL = '';

const option: AxiosRequestConfig = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
};

describe('ApiService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('findThisSurvey', async () => {
    process.env.VUE_APP_SURVEY_NAME = 'surveyName';
    const mockedResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const survey = await apiService.findThisSurvey();
    expect(axios.get).toHaveBeenLastCalledWith('/survey?surveyName=surveyName', option);
    expect(survey).toEqual({});
  });

  it('findAllTeams', async () => {
    const mockedResponse: AxiosResponse = {
      data: [{}],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const result = await apiService.findAllTeams();
    expect(axios.get).toHaveBeenLastCalledWith('/team', option);
    expect(result).toEqual([{}]);
  });

  it('findSurveyResults', async () => {
    const mockedResponse: AxiosResponse = {
      data: [{}],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const startDate = '2022-04-01';
    const endDate = '2022-04-30';
    const result = await apiService.findSurveyResults(startDate, endDate);
    expect(axios.get).toHaveBeenLastCalledWith('/survey-result?startDate=2022-04-01&endDate=2022-04-30', option);
    expect(result).toEqual([{}]);
  });

  it('saveSurveyResult', async () => {
    const mockedResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);
    const result = await apiService.saveSurveyResult({} as SurveyResult);
    expect(axios.post).toHaveBeenLastCalledWith('/survey-result', {}, option);
    expect(result).toEqual({});
  });
});
