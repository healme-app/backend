import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { getGooPlaceDto } from "../../../../models/google-place";
import { nearbySearch } from "../../../../modules/google-api";
import { GooNearbyFieldMask } from "../../../../types/google-api/nearby-field-mask";
import { Place } from "../../../../models/place";

export const GET: RequestHandler[] = [
  validateData(getGooPlaceDto),
  async (req, res) => {
    const fieldMask: GooNearbyFieldMask[] = [
      '*'
    ]
    const threshold: number = 10
    const init = await Place.find()
    console.log(init)
    const placeData = await nearbySearch(req.body, fieldMask)
    console.log(placeData)
    // search another place only if
    // theres no enough amount of place on our database
    

    res.status(200).send({ data: placeData })
  }
]