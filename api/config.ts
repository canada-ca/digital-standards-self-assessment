import * as dotenv from 'dotenv';

// load the environment variables from the .env file
dotenv.config({
  path: '.env',
});

export const MONGODB_PROTOCAL = process.env.MONGODB_PROTOCAL as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const MONGODB_USER = process.env.MONGODB_USER as string;
export const MONGODB_PASS = process.env.MONGODB_PASS as string;
export const MONGODB_DBNAME = process.env.MONGODB_DBNAME as string;
export const MONGODB_OPTIONS = process.env.MONGODB_OPTIONS as string;
