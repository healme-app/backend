import dotenv from "dotenv";

dotenv.config()

const port: number = Number(process.env.PORT) || 6969
const mongo_url: string = process.env.MONGO_URL || ""

export const config = {
  server: {
    port
  },
  db: {
    mongo_url
  }
}