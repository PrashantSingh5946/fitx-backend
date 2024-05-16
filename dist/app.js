"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const connection = require("./lib/database/mongoose");
const RecipeModel = require("./models/Recipe.model");
const cors = require("cors");
const axios = require("axios");
const AuthController = require("./controllers/AuthController");
const RecipeController = require("./controllers/RecipeController");
const HealthController = require("./controllers/HealthController");
const app = express();
const origins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : [];
// Allow requests from the frontend
app.use(cors({
    origin: origins, // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
//Various controllers
app.use("/auth", AuthController);
app.use("/health", HealthController);
app.use("/recipe", RecipeController);
//Route to check the API health
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Up and running");
}));
app.listen(process.env.PORT || 6000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection;
        console.log("Database connection established");
    }
    catch (error) {
        console.log("Database connection error");
        console.log(error);
    }
    console.log("Server listening on port " + 3001);
}));
