import { Router } from "express";
import { check } from "express-validator";
import checkAuth from "../middleware/check-auth.js";
import fileUpload from "./../middleware/file-upload.js";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controller.js";

const router = Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router
  .route("/:pid")
  .patch(
    [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
    updatePlace
  )
  .delete(deletePlace);

export default router;
