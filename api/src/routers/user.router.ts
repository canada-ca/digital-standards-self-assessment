import userController from '../controllers/user.controller';
import { User } from '../models/user.model';
import { Router } from 'express';
import { body, param } from 'express-validator';

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
      param('id').not().isEmpty().trim().escape(),
      body('username').not().isEmpty().trim().escape(),
      body('firstName').not().isEmpty().trim().escape(),
      body('lastName').not().isEmpty().trim().escape(),
      body('email').not().isEmpty().trim().escape(),
      body('email').isEmail().normalizeEmail(),
      body('team').not().isEmpty().trim().escape(),
      userController.update
    );

    this.router.delete('/:id', param('id').not().isEmpty().trim().escape(), userController.delete);

    this.router.get('/:id', userController.findOne);

    this.router.get('/', userController.findAll);
  }
}

export = new UserRouter().router;
