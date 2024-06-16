import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // You can replace `any` with the specific type of your user object
  }
}