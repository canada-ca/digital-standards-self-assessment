import userController from '../controllers/user.controller';
import { User } from '../models/user.model';
import { Router } from 'express';
import { body, param } from 'express-validator';
import * as Auth from '../middleware/auth.middleware';

class UserRouter {
  private _router = Router();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this.router.post(
      '/',
      Auth.authorize(['addUser']),
      body('username').not().isEmpty().trim().escape(),
      body('username').custom((value) => {
        return User.find()
          .where('username')
          .equals(value)
          .then((user) => {
            if (user) {
              return Promise.reject('username already in use');
            }
          });
      }),
      body('firstName').not().isEmpty().trim().escape(),
      body('firstName').custom((value) => {
        if (value !== 'firstName1') {
          throw new Error('wrong first name');
        }
      }),
      body('lastName').not().isEmpty().trim().escape(),
      body('email').not().isEmpty().trim().escape(),
      body('email').isEmail().normalizeEmail(),
      body('team').not().isEmpty().trim().escape(),
      userController.create
    );

    this.router.put(
      '/:id',
      Auth.authorize(['updateUser']),
      param('id').not().isEmpty().trim().escape(),
      body('username').not().isEmpty().trim().escape(),
      body('firstName').not().isEmpty().trim().escape(),
      body('lastName').not().isEmpty().trim().escape(),
      body('email').not().isEmpty().trim().escape(),
      body('email').isEmail().normalizeEmail(),
      body('team').not().isEmpty().trim().escape(),
      userController.update
    );

    this.router.delete(
      '/:id',
      Auth.authorize(['deleteUser']),
      param('id').not().isEmpty().trim().escape(),
      userController.delete
    );

    this.router.get('/:id', Auth.authorize(['getUser']), userController.findOne);

    this.router.get('/', Auth.authorize(['getUser']), userController.findAll);
  }
}

export = new UserRouter().router;
