import { Schema, model } from "mongoose";
import { z } from "zod";

export const updatePredictDto = z.object({
  imageUrl: z.string(),
  result: z.string(),
  explanation: z.string(),
  suggestion: z.string(),
}).partial()

const createPredictDto = updatePredictDto.required()

type TPredict = z.infer<typeof createPredictDto>

const predictSchema = new Schema<TPredict>({
  imageUrl: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
})

export const Predict = model<TPredict>('Predict', predictSchema)