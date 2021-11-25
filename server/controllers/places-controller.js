import { unlink } from "fs";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";

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
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invaild inputs passed, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);
    if (place.creator.toString() !== req.userData.userId)
      throw new Error("You are not allowed to edit this place.");
  } catch (err) {
    return next(new HttpError(err.message, 401));
  }

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
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place now.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find place for provided id.", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("You are not allow to delete this place.", 401));
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place now.", 500)
    );
  }

  unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place has been deleted." });
};
