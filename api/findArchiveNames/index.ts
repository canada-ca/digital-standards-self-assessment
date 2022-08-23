import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const archiveNames = await surveyResultService.findArchiveNames();
    if (archiveNames && archiveNames.length > 0) {
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: archiveNames,
      };
    } else {
      context.res = {
        status: 404,
        body: {
          message: 'No archive name was found',
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
