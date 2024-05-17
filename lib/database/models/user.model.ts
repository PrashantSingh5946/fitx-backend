import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  avatar: string;
  refreshToken: string;
  accessToken: string;
  email_verified: boolean;
  fullName: string;
  password: string;
  loginMode: "google" | "email";
  isGoogleAuthorized: boolean;
  goals: [ObjectId];
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    fullName: { type: String },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },
    avatar: { type: String, required: false },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
    password: { type: String, required: false },
    isGoogleAuthorized: { type: Boolean, default: false },
    loginMode: { type: String, required: true },
    goals: { type: [ObjectId], required: false },
  },
  { timestamps: true }
);

const UserModel = models?.User || model<User>("User", userSchema);

export default UserModel;
