import { Schema, model, models } from "mongoose";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  avatar: string;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = models?.User || model<User>("User", userSchema);

export default UserModel;
