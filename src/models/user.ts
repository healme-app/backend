/** @format */

import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  status?: string;
  results?: mongoose.Types.ObjectId[];
  age: number | null;
  gender: "male" | "female" | "other" | null;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },
  status: {
    type: String,
    default: "Created new account!",
  },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }],
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
