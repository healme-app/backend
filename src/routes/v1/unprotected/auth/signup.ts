import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { User, createUserDto } from "../../../../models/user";
import * as bcrypt from 'bcrypt';

export const POST: RequestHandler[] = [
  validateData(createUserDto),
  async (req, res) => {
    const { password: initPass } = req.body
    
    req.body['password'] = await bcrypt.hash(initPass, 10)
    const data = await User.create(req.body)
    
    res.status(201).send({
      data
    })
  }
]