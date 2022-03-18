import { Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import userController from '../controllers/user.controller';
import * as Auth from '../middleware/auth.middleware';
import UserModel from '../models/user.model';

const ANY_ROLES = ['Admin', 'TeamLead', 'TeamMember'];
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
      '/register',
      body('email').not().isEmpty().trim().isEmail(),
      body('email').custom((value) => {
        return UserModel.find()
          .where('email')
          .equals(value)
          .then((user) => {
            if (user) {
              return Promise.reject('email already in use');
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
      body('team').not().isEmpty().trim().escape(),
      (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        userController.register(req, res);
      }
    );

    this.router.post(
      '/login',
      body('email').not().isEmpty().trim().escape(),
      body('password').not().isEmpty().trim().escape(),
      userController.login
    );

    this.router.put(
      '/changePassword',
      Auth.authenticated(),
      body('email').not().isEmpty().trim().escape(),
      body('password').not().isEmpty().trim().escape(),
      body('newPassword').not().isEmpty().trim().escape(),
      userController.changePassword
    );

    this.router.put(
      '/:id',
      Auth.authenticated(),
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
      Auth.authorize(['Admin', 'TeamLead']),
      param('id').not().isEmpty().trim().escape(),
      userController.delete
    );

    this.router.get('/:id', Auth.authenticated(), userController.findOneById);

    this.router.get('/', Auth.authorize(['TeamLead', 'Admin']), userController.findAll);
  }
}

export = new UserRouter().router;
