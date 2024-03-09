const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const axios = require("axios");
const { configDotenv } = require("dotenv");
const app = express();

const env = require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  console.log(process.env.CLIENT_ID);
  console.log(env);
});

app.post("/auth/google", async (req, res) => {
  console.log(process.env.CLIENT_ID);
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
});

app.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRETt,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

app.listen(3001, () => console.log(`server is running`));
