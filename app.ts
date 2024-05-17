const env = require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const connection = require("./lib/database/mongoose");
const RecipeModel = require("./models/Recipe.model");
import { Express, Router } from "express";
const cors = require("cors");
const axios = require("axios");

import { ObjectId } from "mongodb";
import verifyToken from "./lib/middlewares/verifyToken";

const AuthController = require("./controllers/AuthController");
const RecipeController = require("./controllers/RecipeController");
const HealthController = require("./controllers/HealthController");
const ActivityController = require("./controllers/ActivityController");

const app: Express = express();

const origins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

// Allow requests from the frontend
app.use(
  cors({
    origin: origins, // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Various controllers
app.use("/auth", AuthController);
app.use("/health", HealthController);
app.use("/recipe", RecipeController);
app.use("/activity", ActivityController);

//Route to check the API health
app.get("/", async (req, res) => {
  res.send("Up and running");
});

app.listen(process.env.PORT || 6000, async () => {
  try {
    await connection;
    console.log("Database connection established");
  } catch (error) {
    console.log("Database connection error");

    console.log(error);
  }
  console.log("Server listening on port " + 3001);
});
