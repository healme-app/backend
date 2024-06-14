import { Handler, RequestHandler } from "express"
import { validateData } from "../../../../../middlewares/zod-exception"
import { User, updateUserDto } from "../../../../../models/user"

export const GET: Handler = async (req, res) => {
  const { id } = req.params

  const data = await User.findById(id)
  res.status(200).send({ data })
}

export const PATCH: RequestHandler[] = [
  validateData(updateUserDto),
  async (req, res) => {
    const data = await User.findById(req.params.id ,req.body)
    res.status(200).send({ data })
  }
]

export const DELETE: Handler = async (req, res) => {
  const { id } = req.params
  const data = await User.findByIdAndDelete(id)

  res.status(200).send({ data })
}