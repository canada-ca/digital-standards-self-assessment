import * as dotenv from 'dotenv';

// load the environment variables from the .env file
dotenv.config({
  path: '.env',
});

export const PORT = process.env.APP_PORT || 3000;

export const MONGODB_PROTOCAL = process.env.MONGODB_PROTOCAL as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const MONGODB_PORT = process.env.MONGODB_PORT as string;
export const MONGODB_USER = process.env.MONGODB_USER as string;
export const MONGODB_PASS = process.env.MONGODB_PASS as string;
export const MONGODB_DBNAME = process.env.MONGODB_DBNAME as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;
