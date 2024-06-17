import { NextFunction, Request, Response } from "express";
import BadRequestError from "./error/badrequest-error";

export default (req: Request, res: Response, next: NextFunction) => {  
  const fileFormat: string[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
  ]
  if(!req.file) throw new BadRequestError({ code: 404, message: 'File is Required' })
  else if (!fileFormat.includes(req.file.mimetype)) {
    throw new BadRequestError({ 
      code: 404, 
      message: `File format rejected, please provide a file with one of the following formats: ${fileFormat.join(', ')}` 
    });
  }

  next() 
};