/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface IPeriod extends Document {
  open: {
    day: number;
    hour: number;
    minute: number;
  };
  close: {
    day: number;
    hour: number;
    minute: number;
  };
}

export interface IHospital extends Document {
  placeId: string;
  types: string[];
  addressComponents: {
    longText: string;
    shortText: string;
    types: string[];
    languageCode: string;
  }[];
  location: {
    longitude: number;
    latitude: number;
  };
  googleMapsUri: string;
  regularOpeningHours: {
    openNow: boolean;
    periods: IPeriod[];
    weekdayDescriptions: string[];
    secondaryHoursType: string[];
    specialDays: string[];
  };
  displayName: {
    text: string;
    languageCode: string;
  };
  shortFormattedAddress: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema: Schema = new Schema({
  placeId: String,
  types: [String],
  addressComponents: [
    {
      longText: String,
      shortText: String,
      types: [String],
      languageCode: String,
    },
  ],
  location: {
    longitude: Number,
    latitude: Number,
  },
  googleMapsUri: String,
  regularOpeningHours: {
    openNow: Boolean,
    periods: [
      {
        open: {
          day: Number,
          hour: Number,
          minute: Number,
        },
        close: {
          day: Number,
          hour: Number,
          minute: Number,
        },
      },
    ],
    weekdayDescriptions: [String],
    secondaryHoursType: [String],
    specialDays: [String],
  },
  displayName: {
    text: String,
    languageCode: String,
  },
  shortFormattedAddress: String,
  provider: String,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model<IHospital>("Hospital", HospitalSchema);
