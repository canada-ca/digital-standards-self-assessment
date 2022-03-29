import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyService from '../services/survey.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const surveyId = context.req.params.id;
    if (surveyId) {
      const survey = await surveyService.findById(surveyId);
      if (survey) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: survey,
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
      if (Object.keys(req.query).indexOf('latest') > -1) {
        const survey = await surveyService.findLatest();
        if (survey) {
          context.res = {
            // status: 200, /* Defaults to 200 */
            body: survey,
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
        const surveys = await surveyService.findAll();
        if (surveys && surveys.length > 0) {
          context.res = {
            // status: 200, /* Defaults to 200 */
            body: surveys,
          };
        } else {
          context.res = {
            status: 404,
            body: {
              message: 'Survey not found',
            },
          };
        }
      }
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
