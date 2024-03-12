const express = require("express");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const cors = require("cors");
const axios = require("axios");
const app = express();

const env = require("dotenv").config();

app.use(
  cors({
    origin: "https://fitx.trulyprashant.in", // Allow requests from this origin
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

app.listen(3001, () => console.log(`server is running`));
