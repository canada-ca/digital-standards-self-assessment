import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { SurveyResult } from '../models/survey-result.model';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const surveyResult: SurveyResult = req.body;
  try {
    const newSurveyResult = await surveyResultService.create(surveyResult);
    if (newSurveyResult) {
      context.res = {
        statu: '201',
        body: newSurveyResult,
      };
    } else {
      context.res = {
        status: 500,
        body: { message: 'Failed to crate a record.' },
      };
    }
  } catch (err: any) {
    context.log.error(err);
    context.res = {
      status: 500,
      body: { message: err.message },
    };
  }
};

export default httpTrigger;
