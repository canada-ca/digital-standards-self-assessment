import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const resultId = context.req.params.id;
    if (resultId) {
      const result = await surveyResultService.delete(resultId);
      if (result) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: { message: 'The survey result was deleted' },
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `The survey result was not found with ID = ${resultId}`,
          },
        };
      }
    } else {
      context.res = {
        status: 400,
        body: {
          message: `Survey result ID is required`,
        },
      };
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
