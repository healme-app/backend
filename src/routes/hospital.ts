/** @format */

// src/routes/hospital.routes.ts

import { Request, Response, Router } from "express";
import axios from "axios";
import Hospital, { IHospital } from "../models/hospital";
import isAuth from "../middleware/is-auth";

const router = Router();

router.post("/nearby-hospital", isAuth, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.body;

    // Validasi body request
    if (!latitude || !longitude || !radius) {
      return res.status(400).json({
        error: true,
        message:
          "Latitude, longitude, and radius are required in the request body.",
      });
    }

    // Fetch hospitals using Google Maps Places API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${apiKey}`;

    const response = await axios.get(url);
    const results = response.data.results;

    // Transform the results to match the IHospital interface
    const hospitals: IHospital[] = results.map((hospital: any) => ({
      types: hospital.types,
      location: {
        longitude: hospital.geometry.location.lng,
        latitude: hospital.geometry.location.lat,
      },
      googleMapsUri: hospital.url || "",
      regularOpeningHours: {
        openNow: hospital.opening_hours?.open_now || false,
        periods: hospital.opening_hours?.periods || [],
        weekdayDescriptions: hospital.opening_hours?.weekday_text || [],
        secondaryHoursType: [], // Assuming empty array as the default value
        specialDays: [], // Assuming empty array as the default value
      },
      displayName: hospital.name,
      shortFormattedAddress: hospital.vicinity,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Save fetched hospitals to MongoDB (optional based on your needs)
    await Hospital.insertMany(hospitals);

    // Return the hospitals as response
    res.json({
      error: false,
      statusCode: 200,
      data: hospitals,
      count: hospitals.length,
    });
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error);
    res
      .status(500)
      .json({ error: true, message: "Failed to fetch nearby hospitals" });
  }
});

export default router;
