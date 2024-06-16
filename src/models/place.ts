import { Schema, model } from "mongoose";
import { z } from "zod";
import { GooglePlace } from "../types/google-api/nearby-response";
import { PROVIDER } from "../types/global.enum";

export const updatePlaceDto = z.object({
  placeId: z.string(),
  provider: z.enum(Object.values(PROVIDER) as any).transform((val) => String(val)),
  
}).partial()

export const createPlaceDto = updatePlaceDto.required()

type TPlace = z.infer<typeof createPlaceDto>

interface GooPlaceSchema extends Omit<GooglePlace, 'id'> {
  placeId: string
  provider: PROVIDER
}

const PlaceSchema = new Schema<GooPlaceSchema>({
  provider: {
    type: String,
    enum: PROVIDER,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
})

export const Place = model<TPlace>('Place', PlaceSchema)