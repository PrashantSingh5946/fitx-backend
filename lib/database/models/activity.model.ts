import { Schema, Types, model, models } from "mongoose";

export interface Activity {
  userId: Types.ObjectId;
  activityMeasurement: number;
  activityMeasurementUnit: string;
  activityType: "Food" | "Water" | "Workout" | "Sleep";
  name: string;
  comments: string;
}

const activitySchema = new Schema<Activity>(
  {
    name: { type: String, required: true },
    activityType: {
      type: String,
      enum: ["Food", "Water", "Workout", "Sleep"],
      required: true,
    },
    activityMeasurement: { type: Number, required: true },
    activityMeasurementUnit: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: { type: String, required: false },
  },
  { timestamps: true }
);

const ActivityModel =
  models?.Activity || model<Activity>("Activity", activitySchema);

export default ActivityModel;
