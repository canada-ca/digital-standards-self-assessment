import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const resultId = context.req.params.id;
    const deleteCount = await surveyResultService.delete(resultId);
    if (deleteCount > 0) {
      let message = 'One surevey result was deleted.';
      if (deleteCount > 1) {
        message = `{deleteCount} survey results were deleted.`;
      }
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: { message },
      };
    } else {
      const message = resultId
        ? `The survey result was not found with ID = ${resultId}`
        : `The survey result was not found`;
      context.res = {
        status: 404,
        body: {
          message,
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
