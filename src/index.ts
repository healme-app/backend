import express, { RequestHandler, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { router } from "express-file-routing";
import { config } from "./config";
import { Express } from "express";

const app: Express = express()
const APP_VERSION: string = "v1"

app.use(cors())
app.use(bodyParser.json())

app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "unprotected")}))

app.use((req, res, next) => {
  if (req.headers.authorization) next()
  else res.status(403).send({forbidden: true, message: "asd"})
})

app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")}))

app.listen(config.server.port, () => console.log('Started', path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")))