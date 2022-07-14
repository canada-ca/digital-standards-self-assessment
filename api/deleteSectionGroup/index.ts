import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import sectionGroupService from '../services/section-group.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const sectionGroupId = context.req.params.id;
    if (sectionGroupId) {
      const sectionGroup = await sectionGroupService.delete(sectionGroupId);
      if (sectionGroup) {
        context.res = {
          // status: 200, /* Defaults to 200 */
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `Survey not found with ID = ${sectionGroupId}`,
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
