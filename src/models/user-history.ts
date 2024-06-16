import { Schema, Types, model } from "mongoose";
import { z } from "zod";

const updateUserHistoryDto = z.object({
  user: z.instanceof(Object),
  predict: z.instanceof(Object)
}).partial()

export const createUserHistoryDto = updateUserHistoryDto.required()

type TUserHistory = z.infer<typeof createUserHistoryDto>

const UserHistorySchema = new Schema<TUserHistory>({
  user: {
    type: Object,
    required: true
  },
  predict: {
    type: Object,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export const UserHistory = model<TUserHistory>('UserHistory', UserHistorySchema)