import { Schema, model } from "mongoose";
import { GooglePlace } from "../types/google-api/nearby-response";
import { PROVIDER } from "../types/global.enum";
import { PlaceType } from "../types/google-api/place-type.enum";

// how do you ask for the data on beginning
// export const updatePlaceDto = z.object({
//   placeId: z.string(),
//   provider: z.enum(Object.values(PROVIDER) as any).transform((val) => String(val)),
// }).partial()

// export const createPlaceDto = updatePlaceDto.required()
// type TPlace = z.infer<typeof createPlaceDto>


// how do you keep the data on mongo
interface TGooPlace extends Omit<GooglePlace, 'id'> {
  placeId: string
  provider: PROVIDER
}

const PlaceSchema = new Schema<TGooPlace>({
  name: String,
  types: [PlaceType],
  nationalPhoneNumber: String,
  addressComponents: {
    type: Address
  },
  plusCode: {

  },
  location: LatLng,
  viewport: {
    low: {

    }
  }
  provider: {
    type: String,
    enum: PROVIDER,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
})

export const Place = model<TGooPlace>('Place', PlaceSchema)