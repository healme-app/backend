import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export default (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  const originalStatus = res.status;

  let statusCode = Number(httpStatus[200]); // Default status code

  // Override the status method to capture the status code
  res.status = function (code: number) {
    statusCode = code;
    return originalStatus.call(this, code);
  };

  res.json = function (body) {
    // Determine if there's an error based on the status code
    let error: boolean = false;
    if (statusCode < 200 || statusCode >= 300) error = true;

    // Modify the response body
    const transformRes = {
      error,
      statusCode,
      ...body,
    };

    return originalJson.call(this, transformRes);
  };

  next();
}