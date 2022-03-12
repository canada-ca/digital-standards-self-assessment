import { Router } from 'express';
import userRouter from './user.router';
import pingController from '../controllers/ping.controller';
import { serve, setup } from 'swagger-ui-express';
import swaggerDoc from '../swagger.json';

class MasterRouter {
  private _router = Router();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.get('/ping', pingController.ping);
    this._router.use('/api-docs', serve, setup(swaggerDoc));
    this._router.use('/user', userRouter);
    // Add other routers below
  }
}

export = new MasterRouter().router;