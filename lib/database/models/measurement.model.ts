import { Schema, Types, model, models } from "mongoose";

export interface Measurement {
  height: number;
  weight: number;
  measurementUnit: string;
  bmi: number;
  bmr: number;
  maintenanceCalories: number;
  userId: Types.ObjectId;
}

const measurementSchema = new Schema<Measurement>({
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  measurementUnit: { type: String, required: true },
  bmi: { type: Number, required: true },
  bmr: { type: Number, required: true },
  maintenanceCalories: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const MeasurementModel =
  models?.Measurement || model<Measurement>("Measurement", measurementSchema);

export default MeasurementModel;
