import MeasurementModel from "../database/models/measurement.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export const createMeasurements = async (
  measurements: CreateMeasurementParams
) => {
  try {
    await connectToDatabase();

    const newMeasurements = await MeasurementModel.create(measurements);

    return JSON.parse(JSON.stringify(newMeasurements));
  } catch (error) {
    handleError(error);
  }
};

// READ
export const getMeasurementByUserIdAndMeasurementId = async (
  userId: string,
  measurementId: string
) => {
  try {
    await connectToDatabase();

    const measurements = await MeasurementModel.findOne({
      _id: measurementId,
      userId,
    });

    return JSON.parse(JSON.stringify(measurements));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE
export const updateMeasurementByUserIdAndMeasurementId = async (
  userId: string,
  measurementId: string,
  payload: CreateMeasurementParams
) => {
  try {
    await connectToDatabase();

    const response = await MeasurementModel.findOneAndUpdate(
      { _id: measurementId, userId },
      { $set: payload }
    );

    if (!response) throw new Error("Measurement update failed");

    return JSON.parse(
      JSON.stringify(await MeasurementModel.findById(measurementId))
    );
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deleteMeasurementById = async (
  measurementId: string
) => {
  try {
    await connectToDatabase();

    const deletedMeasurement = await MeasurementModel.findByIdAndDelete(
      measurementId
    );

    return deletedMeasurement
      ? JSON.parse(JSON.stringify(deletedMeasurement))
      : null;
  } catch (error) {
    handleError(error);
  }
};
