import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

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
        res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: true, message:'Internal Server Error' });
      }
    }
  };
}