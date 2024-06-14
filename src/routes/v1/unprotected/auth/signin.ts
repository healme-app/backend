import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { loginDto } from "../../../../models/auth";
import { User } from "../../../../models/user";
import * as bcrypt from 'bcrypt';
import { StatusCodes } from "http-status-codes";
import { JWTAuth } from "../../../../modules/auth";

export const POST: RequestHandler[] = [
  validateData(loginDto),
  async (req, res) => {
    const { email, password } = req.body
    const data = await User.findOne({ email }, '+password')
    if(!data) {
      res.status(StatusCodes.FORBIDDEN).send({ message: 'Email or Password incorrect' })
    }else {
      const correct = await bcrypt.compare(password, data.password)
      const token = JWTAuth.sign({ sub: data['_id'] })
      if (!correct) res.status(StatusCodes.FORBIDDEN).send({ message: 'Email or Password incorrect' })
      else res.status(200).send({ data, token })
    }
  }
]