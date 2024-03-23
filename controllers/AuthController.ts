import axios from "axios";
import { NextFunction, Request, Response } from "express";
import {
  OAuth2Client,
  TokenPayload,
  UserRefreshClient,
} from "google-auth-library";

const express = require("express");
import jwt from "jsonwebtoken";
import UserModel, { User } from "../lib/database/models/user.model";
import { verifyGoogleToken } from "../lib/utils";
const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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
// define the about route
router.get("/about", (req: Request, res: Response) => {
  res.send("About birds");
});

//Authorization code flow
router.post("/google", async (req: Request, res: Response) => {
  //Onboard the user through authorization code
  try {
    const tokens = await axios.post("https://oauth2.googleapis.com/token", {
      code: req.body.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    });

    //Decode the token and store the user in the database

    let refreshToken = tokens.data.refresh_token;
    let accessToken = tokens.data.access_token;
    let idToken = tokens.data.id_token;

    //Decode the token and store the user in the database
    let {
      email,
      email_verified,
      name: fullName,
      given_name: firstName,
      family_name: lastName,
    } = JSON.parse(atob(idToken.split(".")[1]));

    //Check if the user exists in the database
    let user = await UserModel.findOne({ email: email });

    if (!user) {
      user = await UserModel.create({
        email,
        firstName,
        lastName,
        accessToken,
        refreshToken,
        avatar: "",
        email_verified,
        fullName,
      });
    }

    res.send(tokens.data);
  } catch (err) {
    res.send(JSON.stringify(err)).status(500);
  }
});

//Refresh token code flow
router.post("/google/refresh-token", async (req: Request, res: Response) => {
  try {
    if (req.body.refreshToken) {
      const user = new UserRefreshClient(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        req.body.refreshToken
      );
      const { credentials } = await user.refreshAccessToken(); // optain new tokens
      res.json(credentials);
    } else {
      res.send("Invalid request");
    }
  } catch (err: any) {
    res.send(JSON.stringify(err.message));
  }
});

//Verify the google login token and send the refresh token and access token
router.post("/google/verify", async (req: Request, res: Response) => {
  console.log(req.body.token);
  try {
    if (req.body.token) {
      const response = await verifyGoogleToken(req.body.token);

      //Valid token received, so issue the access token and refresh token
      const { email } = response.payload as TokenPayload;

      let user: User | null = await UserModel.findOne({ email });

      if (user) {
        res.json({
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
      } else {
        res.json({ shouldAuthorise: true });
      }
    }
  } catch (err: any) {
    console.log(err);
    res.send(err.message);
  }
});

//Route to check if the user exists, for auto login
router.post("/user/exists", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.send(JSON.stringify(err)).status(500);
  }
});

module.exports = router;
