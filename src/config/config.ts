import dotenv from "dotenv";
import { z } from "zod";

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string({
    description: 'MongoDB Connection String',
    required_error: 'Please define your mongodb url'
  })
  .url(),
  NODE_ENV: z.enum([
    'development',
    'test',
    'production'
  ],{
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
});

export const config = envSchema.parse(process.env)