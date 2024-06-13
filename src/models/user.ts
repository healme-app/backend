import { Schema, model } from "mongoose";
import { SEX } from "../types/global.enum";

export interface IUser {
  username: string,
  email: string,
  password: string,
  gender: SEX,
  birthDate: Date
}

const userSchema = new Schema<IUser>({
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
  }
}, {
  timestamps: true,
  versionKey: false
});

export const User = model<IUser>('User', userSchema);