import { Schema, Types, model } from "mongoose";
import { z } from "zod";

const updateUserHistoryDto = z.object({
  user: z.instanceof(Schema.Types.ObjectId),
  predict: z.instanceof(Schema.Types.ObjectId)
}).partial()

export const createUserHistoryDto = updateUserHistoryDto.required()

type TUserHistory = z.infer<typeof createUserHistoryDto>

const UserHistorySchema = new Schema<TUserHistory>({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  predict: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export const UserHistory = model<TUserHistory>('UserHistory', UserHistorySchema)