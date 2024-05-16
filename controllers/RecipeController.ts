import { NextFunction, Request, Response } from "express";
const express = require("express");
import verifyToken from "../lib/middlewares/verifyToken";
import { OpenAI } from "openai"; // Import OpenAI from "openai-api" package
import { ObjectId } from "mongodb";
import { ImageEditParams } from "openai/resources";
import fs from "fs";
import path from "path";

const RecipeModel = require("../models/Recipe.model");

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
};

router.use(timeLog);

// define the home page route
router.get("/", (req: Request, res: Response) => {
  res.send("No route matches");
});

router.post("/create", verifyToken, async (req: Request, res: Response) => {
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
    macros_per_100g: <[<carbs in g>, <protein in g>, <fats in g>, <fiber in g>]>,
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
        console.log(
          `${message.role} > ${
            message.content[0].type === "text"
              ? message.content[0].text.value
              : ""
          }`
        );
      }

      const payload = messages.data.pop()?.content.pop();

      let data = "";

      if (payload && payload.type === "text") {
        data = payload.text.value as string;
      }

      const recipe = new RecipeModel({
        ...JSON.parse(data),
        user_email,
        thumbnail_url: "",
      });

      await recipe.save();

      res.send(recipe);
    } else {
      console.log("The response from open AI " + run.status);
      throw new Error("Error in generating recipe from AI");
    }
  } catch (error) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

router.get("/all", verifyToken, async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeModel.find().limit(5);
    res.status(200).json(recipes);
  } catch (err) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id;
    const { user_email } = req.headers;

    const recipe = await RecipeModel.findOne({
      _id: new ObjectId(recipeId),
      //user_email,
    });
    console.log("🚀 ~ file: router.js:192 ~ router.get ~ recipe:", recipe);
    res.status(200).json(recipe);
  } catch (error) {
    res.send({ message: "Internal server error" }).status(500);
  }
});

router.post(
  "/image/generate",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { prompt, amount = 1, resolution = "1024x1024" } = req.body;

      const response = await openai.images.generate({
        model: "dall-e-3",
        quality: "hd",
        prompt,
        n: 1,
        size: resolution,
      });

      console.log(response);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

//Create a route image/edit which takes an input image and then perfroms edit on it using dall-e 3 utilising the prompt given by the user

router.post("/search", verifyToken, async (req: Request, res: Response) => {
  try {
    console.log("Searching");
    console.log(req.query);
    const { name } = req.query;

    console.log("🚀 ~ file: router.js:225 ~ router.get ~ name", name);

    const recipes = await RecipeModel.find({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { description: { $regex: name, $options: "i" } },
      ],
    }).limit(3);

    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error" }).status(500);
  }
});

module.exports = router;
