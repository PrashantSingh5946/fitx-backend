import RecipeModel from "../database/models/recipe.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export const createRecipe = async (recipe: CreateRecipeParams) => {
  try {
    await connectToDatabase();

    const newRecipe = await RecipeModel.create(recipe);

    return JSON.parse(JSON.stringify(newRecipe));
  } catch (error) {
    handleError(error);
  }
};

// READ
export const getRecipeByIdAndUserId = async (
  userId: string,
  recipeId: string
) => {
  try {
    await connectToDatabase();

    const recipe = await RecipeModel.findOne({
      _id: recipeId,
      userId,
    });

    return JSON.parse(JSON.stringify(recipe));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE
export const updateRecipeByIdAndUserId = async (
  userId: string,
  recipeId: string,
  payload: CreateRecipeParams
) => {
  try {
    await connectToDatabase();

    const response = await RecipeModel.findOneAndUpdate(
      { _id: recipeId, userId },
      { $set: payload }
    );

    if (!response) throw new Error("Recipe update failed");

    return JSON.parse(JSON.stringify(await RecipeModel.findById(recipeId)));
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deleteRecipeById = async (recipeId: string) => {
  try {
    await connectToDatabase();

    const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId);

    return deletedRecipe ? JSON.parse(JSON.stringify(deletedRecipe)) : null;
  } catch (error) {
    handleError(error);
  }
};
