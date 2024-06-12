import { Handler, RequestHandler } from "express";

export const GET: Handler = async (req: RequestHandler, res: ResponseHandler) => {
  res.send("OK GET Unprotected")
}

export const POST: Handler = async (req: Request, res) => {
  res.send("OK POST Unprotected")
}

export const PATCH: Handler = async (req: Request, res) => {
  res.send("OK PATCH Unprotected")
}

export const DELETE: Handler = async (req, res) => {
  res.send("OK DELETE Unprotected")
}