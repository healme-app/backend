import { z } from "zod";
import { PlaceTypeA } from "../types/google-api/place-type.enum";

export const getGooPlaceDto = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0).max(50000),
  includedTypes: z.nativeEnum(PlaceTypeA).optional(),
  excludedTypes: z.nativeEnum(PlaceTypeA).optional(),
  includedPrimaryTypes: z.nativeEnum(PlaceTypeA).optional(),
  excludedPrimaryTypes: z.nativeEnum(PlaceTypeA).optional(),
})

export type TGooPlace = z.infer<typeof getGooPlaceDto>