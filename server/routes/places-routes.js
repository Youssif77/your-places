import { Router } from "express";
import { check } from "express-validator";

import fileUpload from "./../middleware/file-upload.js";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controller.js";

const router = Router();

router
  .route("/:pid")
  .get(getPlaceById)
  .patch(
    [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
    updatePlace
  )
  .delete(deletePlace);

router.route("/user/:uid").get(getPlacesByUserId);

router
  .route("/")
  .post(
    fileUpload.single("image"),
    [
      check("title").not().isEmpty(),
      check("description").isLength({ min: 5 }),
      check("address").not().isEmpty(),
    ],
    createPlace
  );

export default router;
