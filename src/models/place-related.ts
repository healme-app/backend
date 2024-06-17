import { Schema } from "mongoose";
import { 
  AddressComponent, 
  DateInfo, 
  LatLng, 
  LocalizedText, 
  OpeningHour, 
  Periode, 
  Point
} from "../types/google-api/nearby-response";
import { PlaceType } from "../types/google-api/place-type.enum";
import { SecondaryHoursType } from "../types/google-api/index.enum";

const AddressComponentSchema = new Schema<AddressComponent>({
  longText: { type: String },
  shortText: { type: String },
  types: { type: [Object.values(PlaceType)] },
  languageCode: { type: String }
},{
  _id: false,
});

const LatLngSchema = new Schema<LatLng>({
  latitude: { type: Number },
  longitude: { type: Number }
},{
  _id: false,
})

const DateInfoSchema = new Schema<DateInfo>({
  year: { type: Number },
  month: { type: Number },
  day: { type: Number },
},{
  _id: false,
})

const PointSchema = new Schema<Point>({
  truncated: { type: Boolean },
  day: { type: Number },
  hour: { type: Number },
  minute: { type: Number },
  date: { type: DateInfoSchema }
},{
  _id: false,
})

const PeriodeSchema = new Schema<Periode>({
  open: { type: PointSchema },
  close: { type: PointSchema }
},{
  _id: false,
})

const OpeningHourSchema = new Schema<OpeningHour>({
  openNow: { type: Boolean },
  periods: { type: [PeriodeSchema] },
  weekdayDescriptions: { type: [String] },
  secondaryHoursType: { type: Object.values(SecondaryHoursType) },
  specialDays: [{
    date: { type: DateInfoSchema }
  }]
},{
  _id: false,
})

const LocalizedTextSchema = new Schema<LocalizedText>({
  text: { type : String },
  languageCode: { type: String }
}, {
  _id: false
})

export {
  AddressComponentSchema,
  LatLngSchema,
  OpeningHourSchema,
  LocalizedTextSchema,
}