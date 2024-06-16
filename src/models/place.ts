import { Schema, model } from "mongoose";
import { z } from "zod";
import { GooglePlace } from "../types/google-api/nearby-response";

export const updatePlaceDto = z.object({
  
}).partial()

export const createPlaceDto = updatePlaceDto.required()

type TPlace = z.infer<typeof createPlaceDto>

const PlaceSchema = new Schema<GooglePlace>({
  name: String,
  
}, {
  timestamps: true,
  versionKey: false
})

export const Place = model<TPlace>('Place', PlaceSchema)