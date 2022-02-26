import { Request, Response, NextFunction } from 'express';
import { validateToken } from './../utils/jwt.utils';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
export const authorize = (allowedAccessTypes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    let jwt = req.headers.authorization;

    // verify request has token
    if (!jwt) {
      return res.status(401).json({ message: 'Invalid token ' });
    }

    // remove Bearer if using Bearer Authorization mechanism
    if (jwt.toLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    // verify token hasn't expired yet
    const decodedToken = await validateToken(jwt);

    const hasAccessToEndpoint = allowedAccessTypes.some((at) => decodedToken.accessTypes.some((uat) => uat === at));

    if (!hasAccessToEndpoint) {
      return res.status(401).json({ message: 'No enough privileges to access endpoint' });
    }

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Expired token' });
      return;
    }
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
};
