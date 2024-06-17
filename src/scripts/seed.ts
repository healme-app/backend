import mongoose from "mongoose";
import logger from "../config/logger"
import { TUser, User } from "../models/user"
import { config } from "../config/config";
import { SEX } from "../types/global.enum";

const user: TUser[] = [
  {
    username: 'Atmins',
    email: 'atminsss@gmail.com',
    password: 'Atmins123!',
    gender: SEX.male,
    birthDate: new Date(),
    weight: 66,
    isAdmin: true,
  }
]

async function main(){
  try {
    mongoose.connect(config.DATABASE_URL, {
      dbName: 'development'
    })
    .then(() => { logger.info('Connected to MongoDB') })
    .catch((error) => logger.error(error));

    logger.info('Seeding start...')
    for (const data of user){
      var query = { 'username': data.username }
      const res = await User.findOneAndUpdate(query, data, { upsert: true })
      console.log(res)
    }
  } catch (error) {
    logger.error(error)
    throw new Error('Something Went Wrong!')
  }
}

main()