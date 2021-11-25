import axios from "axios";
import HttpError from "../models/http-error.js";

const API_KEY = process.env.GOOGLE_API_KYE;

const getCoordsForAddress = async (address) => {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = res.data;

  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

export default getCoordsForAddress;
