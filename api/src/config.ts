import dotenv from 'dotenv';

// load the environment variables from the .env file
dotenv.config({
  path: '.env',
});

export const PORT = process.env.APP_PORT || 3000;

export const MONGODB_URL = process.env.MONGODB_URL;
export const MONGODB_PORT = process.env.MONGODB_PORT;
export const MONGODB_USER = process.env.MONGODB_USER;
export const MONGODB_PASS = process.env.MONGODB_PASS;
export const MONGODB_DBNAME = process.env.MONGODB_DBNAME;
