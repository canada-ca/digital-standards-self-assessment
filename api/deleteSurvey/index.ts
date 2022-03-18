import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyService from '../services/survey.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const surveyId = context.req.params.id;
    if (surveyId) {
      const survey = await surveyService.deleteSurvey(surveyId);
      if (survey) {
        context.res = {
          // status: 200, /* Defaults to 200 */
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `Survey not found with ID = ${surveyId}`,
          },
        };
      }
    } else {
      context.res = {
        status: 400,
        body: 'Survey ID is required',
      };
      return;
    }
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      body: err,
    };
  }
};

export default httpTrigger;
