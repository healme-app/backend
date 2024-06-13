import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { router } from "express-file-routing";
import { config } from "./config/config";
import { Express } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "./config/logger";

const app: Express = express()
const APP_VERSION: string = "v1"

// Connect to Database
mongoose.connect(config.DATABASE_URL, {
    dbName: 'development'
  })
  .then(() => { logger.info('Connected to MongoDB') })
  .catch((error) => logger.error(error));

// Set Security HTTP headers
app.use(helmet())
app.use(cors())

// Parse JSON Request Body
app.use(bodyParser.json())

// File-based routing
app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "unprotected")}))

app.use((req, res, next) => {
  if (req.headers.authorization) next()
  else res.status(403).send({forbidden: true, message: "asd"})
})

app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")}))

app.listen(config.PORT, () => console.log('Started', path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")))