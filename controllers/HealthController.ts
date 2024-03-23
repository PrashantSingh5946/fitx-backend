import axios from "axios";
import { NextFunction, Request, Response } from "express";
import {
  OAuth2Client,
  TokenPayload,
  UserRefreshClient,
} from "google-auth-library";

const express = require("express");
import jwt from "jsonwebtoken";
import UserModel from "../lib/database/models/user.model";
import { checkAccessTokenValidity, verifyGoogleToken } from "../lib/utils";
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
// router.post("/heartData", async (req: Request, res: Response) => {
//   let credential = req.body.credential;

//   if (!credential) {
//     res.send("Invalid Request").status(401);
//   }

//   if (credential && typeof credential === "string") {
//     //validate the google sign in token
//     try {
//       let response = await verifyGoogleToken(credential);
//       console.log(response);

//       const { email } = response.payload as TokenPayload;

//       const user = await UserModel.findOne({ email: email });

//       if (!user) {
//         res.send("User not found").status(404);
//       }

//       let accessToken = user.accessToken;
//       let refreshToken = user.refreshToken;

//       response = await checkAccessTokenValidity(
//         accessToken,
//         refreshToken,
//         user.email
//       );

//       console.log("Valid access token recieved");
//       res.send(response.payload);
//     } catch (error: any) {
//       res.status(401).send(error.message);
//     }
//   }
// });

module.exports = router;
