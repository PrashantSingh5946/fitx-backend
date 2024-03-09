import { Schema, Types, model, models } from "mongoose";

interface Nutrition {
  protein: string;
  carb: string;
  fat: string;
}

export interface Recipe {
  name: string;
  tags: string[];
  ingredients: string[];
  creatorId: Types.ObjectId;
  recipe: string;
  nutrition: Nutrition;
}

const recipeSchema = new Schema<Recipe>(
  {
    name: { type: String, required: true },
    tags: { type: [String], required: true },
    ingredients: { type: [String], required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: String, required: true },
    nutrition: {
      protein: { type: String, required: true },
      carb: { type: String, required: true },
      fat: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const RecipeModel = models?.Recipe || model<Recipe>("Recipe", recipeSchema);

export default RecipeModel;
