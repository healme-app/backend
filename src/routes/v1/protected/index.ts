import { Handler } from "express";

export const GET: Handler = async (req, res) => {
  res.send("OK GET Protected")
}

export const POST: Handler = async (req, res) => {
  res.send("OK POST Protected")
}

export const PATCH: Handler = async (req, res) => {
  res.send("OK PATCH Protected")
}

export const DELETE: Handler = async (req, res) => {
  res.send("OK DELETE Protected")
}