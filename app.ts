const env = require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const connection = require("./lib/database/mongoose");
const RecipeModel = require("./models/Recipe.model");
import { Express, Router } from "express";
const cors = require("cors");
const axios = require("axios");
const AuthController = require("./controllers/AuthController");
const HealthController = require("./controllers/HealthController");
import { ObjectId } from "mongodb";

const app: Express = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const origins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: origins, // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(express.json());

app.use("/auth", AuthController);
app.use("/health", HealthController);

app.get("/", async (req, res) => {
  res.send("Up and running");
});

app.post("/recipe/create", async (req, res) => {
  try {
    const { user_email } = req.headers;
    console.log("User email ", user_email);
    console.log(req.body);
    const { name, nutritionalPreference, dietaryPreferences, allergies } =
      req.body;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(thread.id, {
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
    macros_per_100g: <["<carbs>", "<protein>", "<fats>", "<fiber>"]>,
    calories: <int>,
    dietary_restrictions: <dietary restrictions>,
    allergy_warning: <allergy warning>,
    }.`,
    });

    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_wjM1F7JHA9nYJrgog39WqoXJ",
    });

    while (["queued", "in_progress", "cancelling"].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }

      let data = messages.data.pop().content.pop().text.value;

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        quality: "standard",
        prompt: JSON.parse(data).name,
        n: 1,
        size: "1024x1024",
      });

      const recipe = new RecipeModel({
        ...JSON.parse(data),
        user_email,
        thumbnail_url: imageResponse.data[0].url,
      });

      await recipe.save();

      res.send(recipe);
    } else {
      console.log("The response from open AI " + run.status);
    }
  } catch (error) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

app.get("/recipe/all", async (req, res) => {
  try {
    const recipes = await RecipeModel.find().limit(5);
    res.status(200).json(recipes);
  } catch (err) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

app.get("/recipe/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { user_email } = req.headers;

    const recipe = await RecipeModel.findOne({
      _id: new ObjectId(recipeId),
      //user_email,
    });
    console.log("🚀 ~ file: app.js:192 ~ app.get ~ recipe:", recipe);
    res.status(200).json(recipe);
  } catch (error) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

app.post("/image/generate", async (req, res) => {
  try {
    const { prompt, amount = 1, resolution = "1024x1024" } = req.body;

    const response = await openai.images.generate({
      model: "dall-e-3",
      quality: "standard",
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    console.log(response);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
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
