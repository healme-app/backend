import axios from "axios";
import { GooglePlace, GooglePlaceNearbyResponse } from "../types/google-api/nearby-response";
import { GooNearbyFieldMask } from "../types/google-api/nearby-field-mask";
import { config } from "../config/config";
import { TGooPlace } from "../models/google-place";
import logger from "../config/logger";
import BadRequestError from "../middlewares/error/badrequest-error";

const BASE_URL = 'https://places.googleapis.com/v1/';

export async function nearbySearch(body: TGooPlace, fieldMask: GooNearbyFieldMask[]): 
  Promise<GooglePlace[]> {
  try {
    const { latitude, longitude, radius, ...d } = body;
    const reqBody = {
      locationRestriction: {
        circle: { center: { latitude, longitude }, radius },
      },
      ...d,
    };

    const headers = {
      'X-Goog-FieldMask': fieldMask.join(','),
      'X-Goog-Api-Key': config.GOOGLE_API_KEY,
    };

    const { data } = await axios.post<GooglePlaceNearbyResponse>(
      BASE_URL + 'places:searchNearby',
      { ...reqBody },
      { headers },
    );
    const { places } = data;
    return places;
  } catch (error: any) {
    if (error.response) {
      logger.error(
        `Request failed with status code ${error.response.status}`,
      );
      logger.error(error.response.data);
    } else if (error.request) {
      logger.error('Request made but no response received');
      logger.error(error.request);
    } else {
      logger.error(`Error setting up the request: ${error.message}`);
    }
    throw new BadRequestError({ code: 404, message: 'Internal Server Error', context: error })
  }
}