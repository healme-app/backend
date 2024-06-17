import { NextFunction, Request, Response } from "express";
import { CustomError } from "./custom-error";
import httpStatus from "http-status";
import logger from "../../config/logger";
import BadRequestError from "./badrequest-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if(logging) {
      logger.error(JSON.stringify({
        code: err.statusCode,
        errors: err.errors,
        stack: err.stack,
      }, null, 2));
    }

    return res.status(statusCode).send({ errors });
  } else {
    // Unhandled errors
    logger.error(JSON.stringify(err, null, 2));
    throw new BadRequestError({code: 500, message: httpStatus['500_MESSAGE'], logging: true })
  }

};