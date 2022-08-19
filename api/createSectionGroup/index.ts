import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { SectionGroup } from '../models/section-group.model';
import sectionGroupService from '../services/section-group.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const body = req.body;

  try {
    const sectionGroup: SectionGroup = req.body;
    const newSectionGroup = await sectionGroupService.create(sectionGroup);
    if (!!newSectionGroup) {
      context.res = {
        statu: 201,
        body: newSectionGroup,
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
