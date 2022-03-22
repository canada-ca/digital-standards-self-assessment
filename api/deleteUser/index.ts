import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import userService from '../services/user.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const userId = context.req.params.id;
    if (userId) {
      const user = await userService.delete(userId);
      if (user) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: { message: 'The user was deleted' },
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `User not found with ID = ${userId}`,
          },
        };
      }
    } else {
      context.res = {
        status: 400,
        body: {
          message: `User ID is required`,
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
