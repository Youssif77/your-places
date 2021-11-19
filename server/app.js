import express from "express";
import bodyParser from "body-parser";

import placesRouter from "./routes/places-routes.js";

const app = express();
app.use(placesRouter);
app.listen(5000);
