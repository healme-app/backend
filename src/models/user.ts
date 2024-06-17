import { Schema, model } from "mongoose";
import { SEX } from "../types/global.enum";
import { boolean, z } from "zod"

export const updateUserDto = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  gender: z.enum(Object.values(SEX) as any).transform((val) => String(val)),
  birthDate: z.string().date().transform((val) => new Date(val)),
  weight: z.number().positive(),
  isAdmin: z.boolean()
}).partial()

export const createUserDto = updateUserDto.required()

export type TUser = z.infer<typeof createUserDto>

const userSchema = new Schema<TUser>({
  username: { 
    type: String, 
    required: true,
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  gender: {
    type: String,
    enum: SEX,
    required: true, 
  },
  birthDate: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

export const User = model<TUser>('User', userSchema);