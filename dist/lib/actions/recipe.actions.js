"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipeById = exports.updateRecipeByIdAndUserId = exports.getRecipeByIdAndUserId = exports.createRecipe = void 0;
const recipe_model_1 = __importDefault(require("../database/models/recipe.model"));
const connectToDatabase = require("../database/mongoose");
const utils_1 = require("../utils");
// CREATE
const createRecipe = (recipe) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const newRecipe = yield recipe_model_1.default.create(recipe);
        return JSON.parse(JSON.stringify(newRecipe));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.createRecipe = createRecipe;
// READ
const getRecipeByIdAndUserId = (userId, recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const recipe = yield recipe_model_1.default.findOne({
            _id: recipeId,
            userId,
        });
        return JSON.parse(JSON.stringify(recipe));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.getRecipeByIdAndUserId = getRecipeByIdAndUserId;
// UPDATE
const updateRecipeByIdAndUserId = (userId, recipeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const response = yield recipe_model_1.default.findOneAndUpdate({ _id: recipeId, userId }, { $set: payload });
        if (!response)
            throw new Error("Recipe update failed");
        return JSON.parse(JSON.stringify(yield recipe_model_1.default.findById(recipeId)));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.updateRecipeByIdAndUserId = updateRecipeByIdAndUserId;
// DELETE
const deleteRecipeById = (recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const deletedRecipe = yield recipe_model_1.default.findByIdAndDelete(recipeId);
        return deletedRecipe ? JSON.parse(JSON.stringify(deletedRecipe)) : null;
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.deleteRecipeById = deleteRecipeById;
