import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import placesRouter from "./routes/places-routes.js";
import usersRouter from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

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

const uri =
  "mongodb+srv://youssif:UvgU5GAccb7EWV9@cluster0.oq75y.mongodb.net/places?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to DB");
    app.listen(5000);
  })
  .catch((err) => console.log("Connection Failed!", err));
