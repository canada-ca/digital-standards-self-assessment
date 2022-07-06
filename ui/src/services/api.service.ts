import { JobTitle, Survey, SurveyResult, Team } from '@/interfaces/api-models';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const option: AxiosRequestConfig = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
};

class ApiService {
  get apiBaseUrl() {
    return process.env.VUE_APP_API_BASE_URL;
  }

  async findLatestSurvey(): Promise<Survey> {
    try {
      const res: AxiosResponse<Survey> = await axios.get<Survey>(`${this.apiBaseUrl}/survey?latest=true`, option);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async findAllTeams(): Promise<Team[]> {
    try {
      const res: AxiosResponse<Team[]> = await axios.get<Team[]>(`${this.apiBaseUrl}/team`, option);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async findAllJobTitles(): Promise<JobTitle[]> {
    try {
      const res: AxiosResponse<JobTitle[]> = await axios.get<JobTitle[]>(`${this.apiBaseUrl}/job-title`, option);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async findSurveyResults(startDate: string, endDate: string): Promise<SurveyResult[]> {
    try {
      const res: AxiosResponse<SurveyResult[]> = await axios.get<SurveyResult[]>(
        `${this.apiBaseUrl}/survey-result?startDate=${startDate}&endDate=${endDate}`,
        option
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async saveSurveyResult(surveyResult: SurveyResult): Promise<SurveyResult> {
    try {
      const res: AxiosResponse<SurveyResult> = await axios.post<SurveyResult>(
        `${this.apiBaseUrl}/survey-result`,
        { ...surveyResult, createdAt: new Date() },
        option
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

export default new ApiService();
