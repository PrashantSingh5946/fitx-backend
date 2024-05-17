import { Types } from "mongoose";
import mongoose, { Schema, Document } from "mongoose";

interface Task {
  _id: Types.ObjectId;
  id: string;
  activity_type: string;
  time: number;
  frequency: number;
  quantity: number;
  goal_id: Types.ObjectId;
}

const taskSchema: Schema = new Schema({
  _id: { type: Types.ObjectId },
  activity_type: String,
  time: Number,
  quantity: Number,
  goal_id: { type: Types.ObjectId },
});

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
