import axios from "axios";
import { NextFunction, Request, Response } from "express";
import {
  OAuth2Client,
  TokenPayload,
  UserRefreshClient,
} from "google-auth-library";

import GoalModel from "../lib/database/models/goal.model";
import verifyToken from "../lib/middlewares/verifyToken";
import UserModel from "../lib/database/models/user.model";
import ActivityModel from "../lib/database/models/activity.model";

const express = require("express");
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
  res.send("Activity Controller");
});

// define the route for getting goals
router.get("/goals", async (req: Request, res: Response) => {
  try {
    // Retrieve goals from the database
    const goals = await GoalModel.find();
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error retrieving goals:", error);
    res.status(500).json({ error: "Failed to retrieve goals" });
  }
});

// define the route for posting goals
router.post("/my_goals", verifyToken, async (req: Request, res: Response) => {
  try {
    // Extract goal data from the request body
    const { goals } = req.body;
    console.log(req.body);
    let user = await UserModel.findOne({ email: req.body.email });
    user.goals = [...goals];
    await user.save();

    console.log(await UserModel.findOne({ email: req.body.email }));
    res.json({ status: "Successful" });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

router.get("/my_goals", verifyToken, async (req: Request, res: Response) => {
  try {
    // Extract goal data from the request body

    let user = await UserModel.findOne({ email: req.body.email });
    let goalIds = user.goals;
    let goals = await GoalModel.find({ _id: { $in: goalIds } });
    res.json(goals);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

router.get(
  "/my_activities",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // Extract goal data from the request body

      let user = await UserModel.findOne({ email: req.body.email });
      let goalIds = user.goals;
      let activities = await ActivityModel.find({ userId: user._id }).limit(10);

      res.json(activities);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  }
);

router.post("/log", verifyToken, async (req: Request, res: Response) => {
  try {
    const { activity } = req.body;

    console.log(req.body);

    let user = await UserModel.findOne({ email: req.body.email });

    let doc = await new ActivityModel({
      name: activity.activity_type,
      activityType: "Workout",
      activityMeasurementUnit: "Minutes",
      activityMeasurement: activity.amount,
      userId: user._id,
      comments: activity.comments,
    });

    await doc.save();

    res.json(doc);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

module.exports = router;
