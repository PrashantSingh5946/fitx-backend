import ActivityModel from "../database/models/activity.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export const createActivity = async (activity: CreateActivityParams) => {
  try {
    await connectToDatabase();

    const newActivity = await ActivityModel.create(activity);

    return JSON.parse(JSON.stringify(newActivity));
  } catch (error) {
    handleError(error);
  }
};

// READ
export const getActivityByIdAndUserId = async (
  userId: string,
  activityId: string
) => {
  try {
    await connectToDatabase();

    const activity = await ActivityModel.findOne({
      _id: activityId,
      userId,
    });

    return JSON.parse(JSON.stringify(activity));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE
export const updateActivityByIdAndUserId = async (
  userId: string,
  activityId: string,
  payload: CreateActivityParams
) => {
  try {
    await connectToDatabase();

    const response = await ActivityModel.findOneAndUpdate(
      { _id: activityId, userId },
      { $set: payload }
    );

    if (!response) throw new Error("Activity update failed");

    return JSON.parse(JSON.stringify(await ActivityModel.findById(activityId)));
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deleteActivityById = async (activityId: string) => {
  try {
    await connectToDatabase();

    const deletedactivity = await ActivityModel.findByIdAndDelete(activityId);

    return deletedactivity ? JSON.parse(JSON.stringify(deletedactivity)) : null;
  } catch (error) {
    handleError(error);
  }
};
