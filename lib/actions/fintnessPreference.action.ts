import FitnessPreferenceModel from "../database/models/fitnessPreference.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export const createFitnessPreference = async (
  fitnessPreference: CreateFitnessPreferenceParams
) => {
  try {
    await connectToDatabase();

    const newFitnessPreference = await FitnessPreferenceModel.create(
      fitnessPreference
    );

    return JSON.parse(JSON.stringify(newFitnessPreference));
  } catch (error) {
    handleError(error);
  }
};

// READ
export const getPreferenceByUserIdAndPreferenceId = async (
  userId: string,
  preferenceId: string
) => {
  try {
    await connectToDatabase();

    const fitnessPreference = await FitnessPreferenceModel.findOne({
      _id: preferenceId,
      userId,
    });

    return JSON.parse(JSON.stringify(fitnessPreference));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE
export const updatePreferenceByUserIdAndPreferencieId = async (
  userId: string,
  preferenceId: string,
  payload: CreateFitnessPreferenceParams
) => {
  try {
    await connectToDatabase();

    const response = await FitnessPreferenceModel.findOneAndUpdate(
      { _id: preferenceId, userId },
      { $set: payload }
    );

    if (!response) throw new Error("Fitness preference update failed");

    return JSON.parse(
      JSON.stringify(await FitnessPreferenceModel.findById(preferenceId))
    );
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deletePreferenceByPreferencieId = async (
  preferenceId: string,
) => {
  try {
    await connectToDatabase();

    const deletedPreference = await FitnessPreferenceModel.findByIdAndDelete(preferenceId);

    return deletedPreference
      ? JSON.parse(JSON.stringify(deletedPreference))
      : null;
  } catch (error) {
    handleError(error);
  }
};
