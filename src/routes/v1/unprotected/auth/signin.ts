import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { loginDto } from "../../../../models/auth";
import { User } from "../../../../models/user";
import * as bcrypt from 'bcrypt';
import { JWTAuth } from "../../../../modules/auth";
import httpStatus from "http-status";

export const POST: RequestHandler[] = [
  validateData(loginDto),
  async (req, res) => {
    const { email, password } = req.body
    const data = await User.findOne({ email }, '+password')
    if(!data) {
      res.status(httpStatus.FORBIDDEN).send({ message: 'Email or Password incorrect' })
    }else {
      const correct = await bcrypt.compare(password, data.password)
      const token = JWTAuth.sign(data['_id'])
      if (!correct) res.status(httpStatus.FORBIDDEN).send({ message: 'Email or Password incorrect' })
      else res.status(200).send({ data, token })
    }
  }
]