import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose, { ConnectOptions } from 'mongoose';
import * as config from './config';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { RoleEnum } from './models/user.model';
import masterRouter from './routers/master.router';
import { generateToken } from './utils/jwt.utils';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDB();
    // Only generate a token for lower level environments
    if (process.env.NODE_ENV !== 'production') {
      this.generateTokenForTesting();
    }
  }

  private config() {
    // configure the app to use json and urlencoded from body-parser
    this.app.use(
      urlencoded({
        extended: true,
      })
    );
    this.app.use(json());
    this.app.use(helmet());
    this.app.use(cors());
    // make server app handle any route starting with '/'
    this.app.use('/', masterRouter);
    // make server app handle errors
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  private connectDB() {
    // Connect to MongoDB
    const connectOption: ConnectOptions = {};
    mongoose.connect(
      `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_URL}/${config.MONGODB_DBNAME}?retryWrites=true&w=majority`,
      () => {
        console.log(`Connected to database ${config.MONGODB_DBNAME}`);
      }
    );
  }

  public start(): void {
    // make server listen on some port
    this.app.listen(config.PORT, () => console.log(`> Listening on port ${config.PORT}`));
  }

  private generateTokenForTesting() {
    console.log(
      'bearer',
      generateToken({
        user: {
          email: 'test@gmail.com',
          firstName: 'test1',
          lastName: 'test1LastName',
          team: 'Team1',
          roles: ['Admin', 'TeamLead', 'TeamMember'],
        },
      })
    );
  }
}

const server = new Server();
server.start();
