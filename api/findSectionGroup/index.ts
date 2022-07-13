import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import sectionGroupService from '../services/section-group.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const sectionGroupId = context.req.params.id;
    if (sectionGroupId) {
      const sectionGroup = await sectionGroupService.findById(sectionGroupId);
      if (sectionGroup) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: sectionGroup,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `SectionGroup not found with ID = ${sectionGroupId}`,
          },
        };
      }
    } else {
      const sectionGroups = await sectionGroupService.findAll();
      if (sectionGroups && sectionGroups.length > 0) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: sectionGroups,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: 'SectionGroup not found',
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
