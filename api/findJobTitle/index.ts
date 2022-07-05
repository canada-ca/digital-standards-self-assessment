import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import jobTitleService from '../services/job-title.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const jobTitleId = context.req.params.id;
    if (jobTitleId) {
      const jobTitle = await jobTitleService.findById(jobTitleId);
      if (jobTitle) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: jobTitle,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `JobTitle not found with ID = ${jobTitleId}`,
          },
        };
      }
    } else {
      const jobTitles = await jobTitleService.findAll();
      if (jobTitles && jobTitles.length > 0) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: jobTitles,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: 'JobTitle not found',
          },
        };
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
