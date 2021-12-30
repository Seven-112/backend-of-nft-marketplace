import * as dotenv from 'dotenv';
dotenv.config();

export enum METHOD {
  PATCH = 'patch',
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

/**
 * Environment variables
 */

export const PORT = process.env.PORT;

// URL
export const APP_URI = process.env.APP_URI as string;

//JWT
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = 1 * 60 * 60 * 24; // in seconds , 1 day
