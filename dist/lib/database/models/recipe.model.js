"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    tags: { type: [String], required: true },
    ingredients: { type: [String], required: true },
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: String, required: true },
    nutrition: {
        protein: { type: String, required: true },
        carb: { type: String, required: true },
        fat: { type: String, required: true },
    },
}, { timestamps: true });
const RecipeModel = (mongoose_1.models === null || mongoose_1.models === void 0 ? void 0 : mongoose_1.models.Recipe) || (0, mongoose_1.model)("Recipe", recipeSchema);
exports.default = RecipeModel;
