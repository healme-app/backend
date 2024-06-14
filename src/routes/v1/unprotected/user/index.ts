import { Handler, RequestHandler } from "express";
import { User, createUserDto } from "../../../../models/user";
import { validateData } from "../../../../middlewares/zod-exception";

export const GET: Handler = async (req, res) => {
  const data = await User.find()
  const count = await User.countDocuments()
  
  res.status(200).send({ data, count })
}

export const POST: RequestHandler[] = [
  validateData(createUserDto),
  async (req, res) => {
    const data = await User.create(req.body)
    res.status(201).send({ data })
  }
]
