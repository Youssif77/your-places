import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";

export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, please try again later.", 500)
    );
  }

  if (!places.length) {
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) =>
      place.toObject({
        getters: true,
      })
    ),
  });
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invaild inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/375px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invaild inputs passed, please check your data.", 422);
  }

  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(placeId, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place now.", 500)
    );
  }

  res.json({ place: updatedPlace.toObject({ getters: true }) });
};

export const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findByIdAndDelete(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place now.", 500)
    );
  }

  res.status(204).end();
};
