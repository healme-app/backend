import { RequestHandler } from "express";
import { validateData } from "../../../../middlewares/zod-exception";
import { getGooPlaceDto } from "../../../../models/google-place";
import { nearbySearch } from "../../../../modules/google-api";
import { GooNearbyFieldMask } from "../../../../types/google-api/nearby-field-mask";
import { Place, TPlaceModel } from "../../../../models/place";
import { GooglePlace } from "../../../../types/google-api/nearby-response";
import { PROVIDER } from "../../../../types/global.enum";
import { FilterQuery } from "mongoose";
import logger from "../../../../config/logger";

export const GET: RequestHandler[] = [
  validateData(getGooPlaceDto),
  async (req, res) => {
    const fieldMask: GooNearbyFieldMask[] = ['*']
    const threshold: number = 10
    let data: TPlaceModel[] = []
    let placeData: GooglePlace[] = []

    const filter: FilterQuery<TPlaceModel>= {
      location: {
        $geoWithin: {
          $center: [
            [req.body.longitude, req.body.latitude], 
            req.body.radius
          ]
        }
      }
    }

    const check: TPlaceModel[] = await Place.find(filter).exec()
    // const count: number = await Place.countDocuments(filter)

    if (check.length < threshold) {
      logger.info('Using Google Place API')
      placeData = await nearbySearch(req.body, fieldMask)
      if (placeData.length > 0) {
        for (const d of placeData) {
          // cek dulu ada duplicate atau tidak dari place id
          const isDuplicated = await Place.findOne({ placeId: d.id })
          if(!isDuplicated) {
            const input = sanitazeGooPlaceResponse(d)
            const res = await Place.create(input)
            data.push(res)
          } else {
            data.push(isDuplicated)
          }
        }

      }
    } else {
      logger.info('Not Using Google Place API')
      data.push(...check)
    }
    const count = data.length ?? 0
    res.status(200).send({ data, count })
  }
]

function sanitazeGooPlaceResponse(data: GooglePlace): TPlaceModel {
  const { id } = data
  return {
    placeId: id,
    ...data,
    provider: PROVIDER.GOOGLE
  }
}