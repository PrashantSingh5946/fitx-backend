const { model, Schema } = require("mongoose");

const recipeSchema = new Schema(
  {
    name: String,
    ingredients: Array,
    description: String,
    instructions: Array,
    macros_per_100g: Array,
    calories: Number,
    dietary_restrictions: String,
    allergy_warning: String,
    user_email: String,
    thumbnail_url: String,
  },
  { timestamps: true }
);

const RecipeModel = model("recipe", recipeSchema);

module.exports = RecipeModel;
