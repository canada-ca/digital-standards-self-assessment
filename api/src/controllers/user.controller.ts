import { User } from '../models/user.model';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

class UserController {
  async create(req: Request, res: Response) {
    const { username, firstName, lastName, email, team } = req.body;
    const user = new User({ username, firstName, lastName, email, team });
    user
      .save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  update(req: Request, res: Response) {
    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `User not found by id=${id}`,
          });
        } else {
          res.status(200).send(req.body);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  findOne(req: Request, resp: Response) {
    const id = req.params.id;
    User.findById(id)
      .exec()
      .then((data) => {
        if (!data) {
          resp.status(404).send(`User not found by id=${id}`);
        } else {
          resp.status(200).send(data);
        }
      })
      .catch((err) => {
        resp.status(500).send({
          message: `Could not find User with id=${id}`,
        });
      });
  }

  findAll(req: Request, resp: Response) {
    User.find({})
      .then((data) => {
        if (!data) {
          resp.status(404).send('User not found');
        } else {
          resp.status(200).send(data);
        }
      })
      .catch((err) => {
        resp.status(500).send({
          message: 'Could not find User',
        });
      });
  }

  delete(req: Request, res: Response) {
    const id = req.params.id;
    User.findByIdAndDelete(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `User not found with id=${id}.`,
          });
        } else {
          res.status(204).send({
            message: 'User was deleted successfully!',
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: `Could not delete User with id=${id}`,
        });
      });
  }
}

export = new UserController();
