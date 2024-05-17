import { Schema, model, Document, Types } from "mongoose";

interface Task {
  _id: Types.ObjectId;
  id: string;
  activity_type: string;
  time: number;
  frequency: number;
  quantity: number;
  goal_id: Types.ObjectId;
}

interface Goal extends Document {
  name: string;
  tasks: Task[];
  minTime: number;
  maxTime: number;
}

const goalSchema = new Schema<Goal>(
  {
    name: String,
    tasks: [
      {
        _id: { type: Types.ObjectId },
        id: String,
        activity_type: String,
        time: Number,
        frequency: Number,
        quantity: Number,
        goal_id: { type: Types.ObjectId },
      },
    ],
    minTime: Number,
    maxTime: Number,
  },
  { timestamps: true }
);

const GoalModel = model<Goal>("goal", goalSchema);

export default GoalModel;
