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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const HealthController = require("./controllers/HealthController");
const mongodb_1 = require("mongodb");
const verifyToken_1 = __importDefault(require("./lib/middlewares/verifyToken"));
const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const origins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : [];
app.use(cors({
    origin: origins,
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json());
app.use("/auth", AuthController);
app.use("/health", HealthController);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Up and running");
}));
app.post("/recipe/create", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_email } = req.headers;
        console.log("User email ", user_email);
        console.log(req.body);
        const { name, nutritionalPreference, dietaryPreferences, allergies } = req.body;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const thread = yield openai.beta.threads.create();
        const message = yield openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `give me a recipe based on the following params:-

[

recipe_name: '${name}',

dietary_restriction: '${dietaryPreferences}',

nutritional_preferences: '${nutritionalPreference}',

allergies: '${allergies}',


]


in response format like this

  {
    name: "<Name of the recipe>",
    ingredients: <[ingredients]>,
    description: <100 words>,
    instructions: <[steps]>, //5 steps at least
    macros_per_100g: <[<carbs in g>, <protein in g>, <fats in g>, <fiber in g>]>,
    calories: <int>,
    dietary_restrictions: <dietary restrictions>,
    allergy_warning: <allergy warning>,
    }.`,
        });
        let run = yield openai.beta.threads.runs.create(thread.id, {
            assistant_id: "asst_wjM1F7JHA9nYJrgog39WqoXJ",
        });
        while (["queued", "in_progress", "cancelling"].includes(run.status)) {
            yield new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            run = yield openai.beta.threads.runs.retrieve(run.thread_id, run.id);
        }
        if (run.status === "completed") {
            const messages = yield openai.beta.threads.messages.list(run.thread_id);
            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
            }
            let data = messages.data.pop().content.pop().text.value;
            // const imageResponse = await openai.images.generate({
            //   model: "dall-e-3",
            //   quality: "standard",
            //   prompt: JSON.parse(data).name,
            //   n: 1,
            //   size: "128x128",
            // });
            const recipe = new RecipeModel(Object.assign(Object.assign({}, JSON.parse(data)), { user_email, thumbnail_url: "" }));
            yield recipe.save();
            res.send(recipe);
        }
        else {
            console.log("The response from open AI " + run.status);
            throw new Error("Error in generating recipe from AI");
        }
    }
    catch (error) {
        res.send({ message: "Internal server error" }).status(500);
    }
}));
app.get("/recipe/all", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield RecipeModel.find().limit(5);
        res.status(200).json(recipes);
    }
    catch (err) {
        res.send({ message: "Internal server error" }).status(500);
    }
}));
app.get("/recipe/:id", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.id;
        const { user_email } = req.headers;
        const recipe = yield RecipeModel.findOne({
            _id: new mongodb_1.ObjectId(recipeId),
            //user_email,
        });
        console.log("🚀 ~ file: app.js:192 ~ app.get ~ recipe:", recipe);
        res.status(200).json(recipe);
    }
    catch (error) {
        res.send({ message: "Internal server error" }).status(500);
    }
}));
app.post("/image/generate", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt, amount = 1, resolution = "1024x1024" } = req.body;
        const response = yield openai.images.generate({
            model: "dall-e-3",
            quality: "standard",
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        });
        console.log(response);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
app.post("/recipe/search", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Searching");
        console.log(req.query);
        const { name } = req.query;
        console.log("🚀 ~ file: app.js:225 ~ app.get ~ name", name);
        const recipes = yield RecipeModel.find({
            $or: [
                { name: { $regex: name, $options: "i" } },
                { description: { $regex: name, $options: "i" } },
            ],
        }).limit(3);
        res.status(200).json(recipes);
    }
    catch (error) {
        console.log(error);
        res.send({ message: "Internal server error" }).status(500);
    }
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
