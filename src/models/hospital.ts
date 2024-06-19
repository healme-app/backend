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
  types: string[];
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
  displayName: string;
  shortFormattedAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema: Schema = new Schema({
  types: [String],
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
  displayName: String,
  shortFormattedAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IHospital>("Hospital", HospitalSchema);
