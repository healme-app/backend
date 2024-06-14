import axios from "axios";
import { GooglePlaceNearbyResponse } from "../types/google-api/nearby-response";
import { GooNearbyFieldMask } from "../types/google-api/nearby-field-mask";
import { config } from "../config/config";
import { TGooPlace } from "../models/google-place";

const BASE_URL = 'https://places.googleapis.com/v1/';

export async function nearbySearch(body: TGooPlace, fieldMask: GooNearbyFieldMask[]) {
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
      console.error(
        `Request failed with status code ${error.response.status}`,
      );
      console.error(error.response.data);
    } else if (error.request) {
      console.error('Request made but no response received');
      console.error(error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return { message: 'Google API request failed' };
  }
}