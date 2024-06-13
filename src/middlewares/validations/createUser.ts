import { z } from "zod"

export const createUserDto = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().date()
})