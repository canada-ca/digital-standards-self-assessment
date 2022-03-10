import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as config from './config';
import DbConnection from './db/db.connection';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import masterRouter from './routers/master.router';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDB();
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
    const db = new DbConnection();
  }

  public start(): void {
    // make server listen on some port
    this.app.listen(config.PORT, () => console.log(`> Listening on port ${config.PORT}`));
  }
}

const server = new Server();
server.start();
