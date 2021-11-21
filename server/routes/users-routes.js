import { Router } from "express";
import { check } from "express-validator";

import { getAllUsers, signup, login } from "../controllers/users-controller.js";
const router = Router();

router.route("/").get(getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("places").not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

export default router;
