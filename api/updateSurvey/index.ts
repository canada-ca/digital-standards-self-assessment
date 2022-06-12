import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Survey } from '../models/survey.model';
import surveyService from '../services/survey.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const survey: Partial<Survey> = req.body;
  const surveyId = context.req.params.id;
  if (surveyId) {
    try {
      const surveyUpdated = await surveyService.update(surveyId, survey);
      if (surveyUpdated) {
        context.res = {
          status: 200,
          body: surveyUpdated,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: 'Survey not found',
          },
        };
      }
    } catch (err: any) {
      context.log.error(err);
      context.res = {
        status: 500,
        body: err,
      };
    }
  }
};

export default httpTrigger;
