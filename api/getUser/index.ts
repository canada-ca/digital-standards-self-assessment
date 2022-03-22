import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import userService from '../services/user.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const userId = context.req.params.id;
    if (userId) {
      const user = await userService.findOneById(userId);
      if (user) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: user,
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
      const users = await userService.findAll();
      if (users && users.length > 0) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: users,
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: 'User not found',
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
