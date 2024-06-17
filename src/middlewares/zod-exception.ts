import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { z, ZodError } from 'zod';
import BadRequestError from './error/badrequest-error';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => (
        `${issue.path.join('.')} is ${issue.message}`
        // {
        //   message: `${issue.path.join('.')} is ${issue.message}`,
        // }
      ))
        throw new BadRequestError({code: 404, message: errorMessages[0], logging: true })
      } else {
        throw new BadRequestError({code: 500, message: httpStatus['500_MESSAGE'], logging: true })
      }
    }
  };
}