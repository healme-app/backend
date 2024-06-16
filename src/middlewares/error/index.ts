import { NextFunction, Request, Response } from "express";
import { CustomError } from "./custom-error";
import httpStatus from "http-status";
import logger from "../../config/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if(err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if(logging) {
      console.error(JSON.stringify({
        code: err.statusCode,
        errors: err.errors,
        stack: err.stack,
      }, null, 2));
    }

    return res.status(statusCode).send({ errors });
  }

  // Unhandled errors
  logger.error(JSON.stringify(err, null, 2));
  return res.status(500).send({ error: true, message: httpStatus["500_NAME"] } );
};