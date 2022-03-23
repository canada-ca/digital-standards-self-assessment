import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Survey } from '../models/survey.model';
import surveyService from '../services/survey.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const survey: Survey = req.body;
  try {
    const newSurvey = await surveyService.create(survey);
    if (newSurvey) {
      context.res = {
        statu: '201',
        body: newSurvey,
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
      body: err,
    };
  }
};

export default httpTrigger;
