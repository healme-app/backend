import { Handler, RequestHandler } from "express";
import { User } from "../../../../models/user";
import { createUserDto } from "../../../../middlewares/validations/createUser";
import { validateData } from "../../../../middlewares/zod-exception";

export const GET: Handler = async (req, res) => {
  res.send("OK GET Protected")
}

export const POST: RequestHandler[] = [
  validateData(createUserDto),
  async (req, res) => {
    const data = await User.create(req.body)
    res.status(201).send({ data })
  }
]

export const PATCH: Handler = async (req, res) => {
  res.send("OK PATCH Protected")
}

export const DELETE: Handler = async (req, res) => {
  res.send("OK DELETE Protected")
}

