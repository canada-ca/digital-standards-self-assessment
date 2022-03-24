import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import surveyResultService from '../services/survey-result.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const resultId = context.req.params.id;
    if (resultId) {
      const result = await surveyResultService.findOneById(resultId);
      if (result) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: result,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `Survey Result not found with ID = ${resultId}`,
          },
        };
      }
    } else {
      if (Object.keys(req.query).length === 0) {
        const results = await surveyResultService.findAll();
        if (results && results.length > 0) {
          context.res = {
            // status: 200, /* Defaults to 200 */
            body: results,
          };
        } else {
          context.res = {
            status: 404,
            body: {
              message: 'Survey Result not found',
            },
          };
        }
      } else {
        const startDate = req.query['startDate'];
        const endDate = req.query['endDate'];
        const results = await surveyResultService.findByDateRange(
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        );
        if (results && results.length > 0) {
          context.res = {
            // status: 200, /* Defaults to 200 */
            body: results,
          };
        } else {
          context.res = {
            status: 404,
            body: {
              message: 'Survey Result not found',
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
