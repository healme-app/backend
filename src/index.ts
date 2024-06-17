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
import { extractToken } from "./utils";
import { User } from "./models/user";
import { JWTAuth } from "./modules/auth";
import transformResponse from "./middlewares/transform-response";
import httpStatus from "http-status";
import 'express-async-errors';
import { errorHandler } from "./middlewares/error";
import BadRequestError from "./middlewares/error/badrequest-error";

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

// Transform Response Interceptor
app.use(transformResponse);

// File-based routing
app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "unprotected")}))

// General Default Auth with JWT
app.use( async (req, res, next) => {
  if(req.headers.authorization) {
    const checkToken = extractToken(req.headers.authorization)
    if(!checkToken) res.status(httpStatus.FORBIDDEN).send({ message: 'Authorization Failed'})
    else {
      try {
        const payload = JWTAuth.verify(checkToken)
        const user = await User.findById(payload.sub)
        req['user'] = user
        next()
      } catch (error) {
        logger.info(error)
        if(error instanceof Error) throw new BadRequestError({code: 403, message: error.message, logging: true })
        else throw new BadRequestError({code: 500, message: httpStatus['500_MESSAGE'], logging: true })
      }
    }
  } else res.status(httpStatus.FORBIDDEN).send({ message: 'Login First'})
})

app.use(`/api/${APP_VERSION}`, await router({directory: path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")}))

// Global Error Handler
app.use(errorHandler)

app.listen(config.PORT, () => console.log('Started', path.join(path.dirname(process.argv[1]), "routes", APP_VERSION, "protected")))

// TODO: 
// file upload endpoint
// findAll mongo helpers
// predict endpoint