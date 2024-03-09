import { Schema, Types, model, models } from "mongoose";

export interface FitnessPreference {
  goal: "weightLoss" | "weightGain" | "endurance";
  dailyWaterIntakeGoal: number;
  userId: Types.ObjectId;
}

const fitnessPreferenceSchema = new Schema<FitnessPreference>(
  {
    goal: {
      type: String,
      enum: ["weightLoss", "weightGain", "endurance"],
      required: true,
    },
    dailyWaterIntakeGoal: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const FitnessPreferenceModel =
  models?.FitnessPreference ||
  model<FitnessPreference>("FitnessPreference", fitnessPreferenceSchema);

export default FitnessPreferenceModel;
