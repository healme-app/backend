/** @format */

import mongoose, { Document, Schema, Model } from "mongoose";

interface IResult extends Document {
  result: string;
  imageUrl: string;
  // explanation: string;
  // firstAidRecommendation: string;
  confidenceScore: number;
  user: mongoose.Types.ObjectId;
}

const resultSchema: Schema<IResult> = new Schema(
  {
    result: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    // explanation: {
    //   type: String,
    //   required: true,
    // },
    // firstAidRecommendation: {
    //   type: String,
    //   required: true,
    // },
    confidenceScore: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Result: Model<IResult> = mongoose.model<IResult>("Result", resultSchema);

export default Result;
