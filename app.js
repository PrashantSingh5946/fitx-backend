const express = require("express");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const OpenAI = require("openai");

const cors = require("cors");
const axios = require("axios");
const app = express();

const env = require("dotenv").config();

const origins = process.env.FRONTEND_URL.split(",");

app.use(
  cors({
    origin: origins, // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Up and running");
});

app.post("/auth/google", async (req, res) => {
  try {
    console.log("got request!");
    console.log(req.body.code);

    const tokens = await axios.post("https://oauth2.googleapis.com/token", {
      code: req.body.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    });

    console.log(tokens);
    res.send(tokens.data);
  } catch (err) {
    res.send(JSON.stringify(err)).status(500);
  }
});

app.post("/auth/google/refresh-token", async (req, res) => {
  try {
    console.log("Refresh token requested", req.body.refreshToken);

    if (req.body.refreshToken) {
      const user = new UserRefreshClient(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        req.body.refreshToken
      );

      const { credentials } = await user.refreshAccessToken(); // optain new tokens
      res.json(credentials);
    }
  } catch (err) {
    res.send(JSON.stringify(err)).status(500);
  }
});

// app.post("/recipe/create", async (req, res) => {
//   try {
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const response = await openai.completions.create({
//       model: "gpt-3.5-turbo-instruct",
//       prompt: ` give me 3 recipes that comply with the following dietary requirements
// {
//   allergies
// :
// "Peanut allergy"
// dietaryPreferences
// :
// "vegetarian"
// name
// :
// "Soaked oats"
// nutritionalPreference
// :
// "High in protein, low in sugar"}

// in response format like this

// recipes:
// [{

//     name: "Name of the recipe",
//     ingredients: [ingredients],
//     description: 100 words,
//     instructions: [steps], //5 steps at least
//     macros_per_100g: [carbs, protein, fats],
//     calories: int,
//     dietary_restrictions,
//     allergy_warning,

// }].

// response_type: JSON`,
//       temperature: 1,
//       max_tokens: 834,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });

//     console.log(response.choices[0]);

//     res.json(response.choices[0]);
//   } catch (err) {}
// });

app.post("/recipe/create", async (req, res) => {
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


recipes: [{

name: "Name of the recipe",
ingredients: [ingredients],
description: 100 words,
instructions: [steps], //5 steps at least
macros_per_100g: [carbs: number, protein: number, fats: number, fibre: number],
calories: numbers, //in Cal
dietary_restrictions,
allergy_warning,

          }]. `,
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

    res.send(data);
  } else {
    console.log(run.status);
  }
});

app.listen(process.env.PORT || 3001, () => console.log(`server is running`));
