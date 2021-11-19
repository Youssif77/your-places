import express from "express";
import bodyParser from "body-parser";

import placesRouter from "./routes/places-routes.js";
import usersRouter from "./routes/users-routes.js";

const app = express();

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
