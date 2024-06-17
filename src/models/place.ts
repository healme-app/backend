import { Schema, model } from "mongoose";
import { GooglePlace } from "../types/google-api/nearby-response";
import { PROVIDER } from "../types/global.enum";
import { PlaceType } from "../types/google-api/place-type.enum";
import { AddressComponentSchema, LatLngSchema, LocalizedTextSchema, OpeningHourSchema } from "./place-related";

// export const updatePlaceDto = z.object({
//   placeId: z.string(),
//   provider: z.enum(Object.values(PROVIDER) as any).transform((val) => String(val)),
// }).partial()

// export const createPlaceDto = updatePlaceDto.required()
// type TPlace = z.infer<typeof createPlaceDto>

export interface TPlaceModel extends Pick<GooglePlace, 
  'types' | 
  'addressComponents' |
  'location' |
  'googleMapsUri' |
  'regularOpeningHours' |
  'displayName' |
  'primaryType' |
  'shortFormattedAddress' > {
  placeId: string
  provider: PROVIDER
}

const PlaceSchema = new Schema<TPlaceModel>({
  placeId: { type: String, unique: true },
  types: { type: [Object.values(PlaceType)] },
  addressComponents: { type: [AddressComponentSchema]},
  location: { type: LatLngSchema },
  googleMapsUri: { type: String },
  regularOpeningHours: { type: OpeningHourSchema },
  displayName: { type: LocalizedTextSchema },
  primaryType: { type: String },
  shortFormattedAddress: { type: String },
  provider: {
    type: String,
    enum: PROVIDER,
    required: true,
    default: PROVIDER.GOOGLE
  },
}, {
  timestamps: true,
  versionKey: false
})

PlaceSchema.index({ location: '2dsphere' })

PlaceSchema.pre<TPlaceModel>('save', function(next) {
  if (this.addressComponents && this.addressComponents.length > 0) {
    this.shortFormattedAddress = this.addressComponents.map(ac => ac.shortText).join(', ');
  }
  next();
});

export const Place = model<TPlaceModel>('Place', PlaceSchema)