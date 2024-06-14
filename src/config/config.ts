import dotenv from "dotenv";
import { ZodError, z } from "zod";
import logger from "./logger";

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string({
    description: 'MongoDB Connection String',
    required_error: 'Please define your mongodb url'
  }).url(),
  NODE_ENV: z.enum([
    'development',
    'test',
    'production'
  ], {
    description: 'This gets updated depending on your environment'
  })
    .default('development'),
  PORT: z.coerce
    .number({
      description: ''
    })
    .positive()
    .max(65536, 'options.port should be >= 0 and < 65536')
    .default(3000),
  JWT_SECRET: z.string({
    description: 'JSON WEB TOKEN SECRET',
    required_error: 'Please define your json web token secret'
  }),
  JWT_EXPIRES: z.string()
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue: any) => (`${issue.path.join('.')} : ${issue.message}`))
    logger.error(errorMessages)
    process.exit(1)
  }
}

export const config = envSchema.parse(process.env)