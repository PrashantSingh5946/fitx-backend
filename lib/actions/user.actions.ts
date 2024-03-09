import { revalidatePath } from "next/cache";

import UserModel from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { User } from "@/lib/database/models/user.model";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await UserModel.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await UserModel.findById(userId);

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserByEmailId(email: string) {
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ email: email });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(userId: string, user: CreateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      $set: user,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(await UserModel.findById(userId)));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(userId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await UserModel.findById(userId);

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}
