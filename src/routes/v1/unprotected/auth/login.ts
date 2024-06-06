import { Handler } from "express";

export const POST: Handler = async (req, res) => {
  res.send("OK POST Unprotected")
}