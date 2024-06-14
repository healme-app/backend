import { config } from "../config/config"
import jwt from 'jsonwebtoken';

export class JWTAuth {
  public static verify = (data: string) => jwt.verify(data, config.JWT_SECRET)

  public static sign = (data: any) => jwt.sign({ sub: data }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES })


}