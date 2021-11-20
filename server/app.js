import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import placesRouter from "./routes/places-routes.js";
import usersRouter from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const port = process.env.PORT || 5000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port);
  })
  .catch((err) => console.log("Connection Failed!", err));
