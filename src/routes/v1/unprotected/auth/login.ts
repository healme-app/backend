import { Handler } from "express";

export const POST: Handler = async (req, res) => {
  res.send("Login Auth endpoint")
}