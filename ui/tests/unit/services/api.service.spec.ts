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

  it('findLatestSurvey', async () => {
    const mockedResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const survey = await apiService.findLatestSurvey();
    expect(axios.get).toHaveBeenLastCalledWith('/survey?latest=true', option);
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
    const result = await apiService.findAllSurveyResults();
    expect(axios.get).toHaveBeenLastCalledWith('/survey-result', option);
    expect(result).toEqual([{}]);
  });

  it('findSurveyResultsByUserId', async () => {
    const mockedResponse: AxiosResponse = {
      data: [{}],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const result = await apiService.findSurveyResultsByUserId('userId');
    expect(axios.get).toHaveBeenLastCalledWith('/survey-result?userId=userId', option);
    expect(result).toEqual([{}]);
  });

  it('findArchivedSurveyResults', async () => {
    const mockedResponse: AxiosResponse = {
      data: [{}],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const result = await apiService.findArchivedSurveyResults('archive1');
    expect(axios.get).toHaveBeenLastCalledWith('/survey-result?archiveName=archive1', option);
    expect(result).toEqual([{}]);
  });

  it('findSectionGroups', async () => {
    const mockedResponse: AxiosResponse = {
      data: [{}],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    const result = await apiService.findSectionGroups();
    expect(axios.get).toHaveBeenLastCalledWith('/section-group', option);
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
    expect(axios.post).toHaveBeenLastCalledWith('/survey-result', expect.anything(), option);
    expect(result).toEqual({});
  });
});
