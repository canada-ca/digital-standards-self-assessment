import { JobTitle, SectionGroup, Survey, SurveyResult, Team } from '@/interfaces/api-models';
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
    const res: AxiosResponse<Survey> = await axios.get<Survey>(`${this.apiBaseUrl}/survey?latest=true`, option);
    return res.data;
  }

  async findAllTeams(): Promise<Team[]> {
    const res: AxiosResponse<Team[]> = await axios.get<Team[]>(`${this.apiBaseUrl}/team`, option);
    return res.data;
  }

  async findAllJobTitles(): Promise<JobTitle[]> {
    const res: AxiosResponse<JobTitle[]> = await axios.get<JobTitle[]>(`${this.apiBaseUrl}/job-title`, option);
    return res.data;
  }

  async findSectionGroups(): Promise<SectionGroup[]> {
    const res: AxiosResponse<SectionGroup[]> = await axios.get<SectionGroup[]>(
      `${this.apiBaseUrl}/section-group`,
      option
    );
    return res.data;
  }

  async findAllSurveyResults(): Promise<SurveyResult[]> {
    const res: AxiosResponse<SurveyResult[]> = await axios.get<SurveyResult[]>(
      `${this.apiBaseUrl}/survey-result`,
      option
    );
    return res.data;
  }

  async archiveSurveyResults(archiveName: string): Promise<{ message: string }> {
    const res: AxiosResponse<{ message: string }> = await axios.post<{ message: string }>(
      `${this.apiBaseUrl}/survey-result/archive`,
      { archiveName },
      option
    );
    return res.data;
  }

  async findArchivedSurveyResults(archiveName: string): Promise<SurveyResult[]> {
    const res: AxiosResponse<SurveyResult[]> = await axios.get<SurveyResult[]>(
      `${this.apiBaseUrl}/survey-result?archiveName=${archiveName}`,
      option
    );
    return res.data;
  }

  async findSurveyResultArchiveNames(): Promise<string[]> {
    const res: AxiosResponse<string[]> = await axios.get<string[]>(
      `${this.apiBaseUrl}/survey-result/archive-name`,
      option
    );
    return res.data;
  }

  async findSurveyResultsByUserId(userId: string): Promise<SurveyResult[]> {
    const res: AxiosResponse<SurveyResult[]> = await axios.get<SurveyResult[]>(
      `${this.apiBaseUrl}/survey-result?userId=${userId}`,
      option
    );
    return res.data;
  }

  async saveSurveyResult(surveyResult: SurveyResult): Promise<SurveyResult> {
    const res: AxiosResponse<SurveyResult> = await axios.post<SurveyResult>(
      `${this.apiBaseUrl}/survey-result`,
      { ...surveyResult, createdAt: new Date() },
      option
    );
    return res.data;
  }
}

export default new ApiService();
