import { Mongoose, ConnectOptions, connect } from 'mongoose';
import * as config from '../config';

export default class DbConnection {
  private _mongoose: Mongoose;

  constructor() {
    this.connectDB();
  }

  private async connectDB() {
    const dbOption: ConnectOptions = {
      retryWrites: true,
    };
    try {
      this._mongoose = await connect(
        `${config.MONGODB_PROTOCAL}://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_URL}/${config.MONGODB_DBNAME}`,
        dbOption
      );
      console.log(`Connected to database ${config.MONGODB_DBNAME}`);
    } catch (err) {
      console.error(`Failed to connect database ${config.MONGODB_DBNAME}`, err);
    }
  }

  public get mongoose() {
    if (!this._mongoose) {
      this.connectDB;
    }
    return this._mongoose;
  }
}
