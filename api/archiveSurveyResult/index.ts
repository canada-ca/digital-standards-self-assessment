import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { archiveName } = req.body;
  try {
    const archiveCount = await surveyResultService.archive(archiveName);
    if (archiveCount && archiveCount > 0) {
      context.res = {
        statu: '200',
        body: { message: `${archiveCount} survey results have been archived.` },
      };
    } else {
      context.res = {
        status: 404,
        body: { message: 'No survey results has been archived' },
      };
    }
  } catch (err: any) {
    context.log.error(err);
    context.res = {
      status: 400,
      body: { message: err.message },
    };
  }
};

export default httpTrigger;
