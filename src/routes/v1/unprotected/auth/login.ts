import { Handler } from "express";

export const POST: Handler = async (req: Request, res) => {
  res.send("Login Auth endpoint")
}