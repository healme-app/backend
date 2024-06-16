import { Handler } from "express";
import httpStatus from "http-status";

export const POST: Handler = async (req, res) => {
  // console.log(req)
  console.log(req)
  res.status(201).send({ message: ""})
}