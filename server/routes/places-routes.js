import { Router } from "express";

import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controller.js";

const router = Router();

router.route("/:pid").get(getPlaceById).patch(updatePlace).delete(deletePlace);

router.route("/user/:uid").get(getPlacesByUserId);

router.route("/").post(createPlace);

export default router;
