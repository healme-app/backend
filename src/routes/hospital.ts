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
    const hospitals: IHospital[] = response.data.results;

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
