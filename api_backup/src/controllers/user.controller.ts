import UserModel, { RoleEnum } from '../models/user.model';
import { Request, Response } from 'express';

import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils';
import { userInfo } from 'os';

class UserController {
  register(req: Request, res: Response) {
    const { email, password, firstName, lastName, team } = req.body;
    const userModel = new UserModel({ email, firstName, lastName, team, roles: ['TeamMember'] });
    userModel.password = bcrypt.hashSync(password, 10);
    userModel
      .save()
      .then((newUser) => {
        newUser.password = undefined;
        res.status(201).json(newUser);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  login(req: Request, res: Response) {
    UserModel.findOne({
      email: req.body.email,
    })
      .exec()
      .then((user) => {
        if (!user || !user.comparePassword(req.body.password)) {
          res.status(401).json({
            message: 'Authentication failed!',
          });
        } else {
          res.status(200).json({
            token: generateToken({
              user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                team: user.team,
              },
            }),
          });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  async changePassword(req: Request, res: Response) {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user || !user.comparePassword(req.body.password)) {
      res.status(401).json({
        message: 'User not found or wrong password!',
      });
    } else {
      user.password = bcrypt.hashSync(req.body.newPassword, 10);
      await user.save();
      res.status(200).json({
        message: 'Password changed',
      });
    }
  }

  update(req: Request, res: Response) {
    const id = req.params.id;
    UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `User not found by id=${id}`,
          });
        } else {
          res.status(200).json(req.body);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  findOneById(req: Request, resp: Response) {
    const id = req.params.id;
    UserModel.findById(id)
      .exec()
      .then((data) => {
        if (!data) {
          resp.status(404).json(`User not found by id=${id}`);
        } else {
          resp.status(200).json({ ...JSON.parse(JSON.stringify(data)), password: undefined });
        }
      })
      .catch((err) => {
        resp.status(500).json({
          message: `Could not find User with id=${id}`,
        });
      });
  }

  findAll(req: Request, resp: Response) {
    UserModel.find({})
      .then((data) => {
        if (!data) {
          resp.status(404).json('User not found');
        } else {
          resp.status(200).json(data.map((user) => ({ ...JSON.parse(JSON.stringify(user)), password: undefined })));
        }
      })
      .catch((err) => {
        resp.status(500).json({
          message: 'Could not find User',
        });
      });
  }

  delete(req: Request, res: Response) {
    const id = req.params.id;
    UserModel.findByIdAndDelete(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `User not found with id=${id}.`,
          });
        } else {
          res.status(204).json({
            message: 'User was deleted successfully!',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: `Could not delete User with id=${id}`,
        });
      });
  }
}

export = new UserController();
