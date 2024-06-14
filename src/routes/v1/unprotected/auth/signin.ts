import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { loginDto } from "../../../../models/auth";
import { User } from "../../../../models/user";
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import httpStatus from "http-status";
import { config } from "../../../../config/config";

export const POST: RequestHandler[] = [
  validateData(loginDto),
  async (req, res) => {
    const { email, password } = req.body
    const data = await User.findOne({ email }, '+password')
    if(!data) {
      res.status(httpStatus.FORBIDDEN).send({ message: 'Email or Password incorrect' })
    }else {
      const correct = await bcrypt.compare(password, data.password)
      const token = jwt.sign({ sub: data['_id'] }, config.JWT_SECRET, { expiresIn: "1h" })
      if (!correct) res.status(httpStatus.FORBIDDEN).send({ message: 'Email or Password incorrect' })
      else res.status(200).send({ data, token })
    }
  }
]