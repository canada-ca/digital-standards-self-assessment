import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose, { ConnectOptions } from 'mongoose';
import * as config from './config';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import masterRouter from './routers/master.router';
import { generateToken } from './utils/jwt.utils';

// Connect to MongoDB
const connectOption: ConnectOptions = {};
mongoose.connect(
  `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_URL}/${config.MONGODB_DBNAME}?retryWrites=true&w=majority`,
  () => {
    console.log(`Connected to database ${config.MONGODB_DBNAME}`);
  }
);

// Only generate a token for lower level environments
if (process.env.NODE_ENV !== 'production') {
  console.log(
    'bearer',
    generateToken({
      name: 'Andrés Reales',
      userId: 123,
      accessTypes: ['getUser', 'addUser', 'updateUser', 'deleteUser'],
    })
  );
}

const app = express();
// configure the app to use json and urlencoded from body-parser
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(helmet());
app.use(cors());
app.use(json());

// make server listen on some port
app.listen(config.PORT, () => console.log(`> Listening on port ${config.PORT}`));

// make server app handle any route starting with '/'
app.use('/', masterRouter);

// make server app handle errors
app.use(errorHandler);
app.use(notFoundHandler);
