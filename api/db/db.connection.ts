import * as mongoose from 'mongoose';
import * as config from '../config';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(
        `${config.MONGODB_PROTOCAL}://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_URL}/${config.MONGODB_DBNAME}`,
        {
          autoIndex: true, //make this also true
        }
      );
      console.log(`Connected to database ${config.MONGODB_DBNAME}`);
    }
  } catch (err) {
    console.error(`Failed to connect database ${config.MONGODB_DBNAME}`, err);
  }
}
