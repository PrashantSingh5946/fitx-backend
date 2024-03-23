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
exports.deletePreferenceByPreferencieId = exports.updatePreferenceByUserIdAndPreferencieId = exports.getPreferenceByUserIdAndPreferenceId = exports.createFitnessPreference = void 0;
const fitnessPreference_model_1 = __importDefault(require("../database/models/fitnessPreference.model"));
const connectToDatabase = require("../database/mongoose");
const utils_1 = require("../utils");
// CREATE
const createFitnessPreference = (fitnessPreference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const newFitnessPreference = yield fitnessPreference_model_1.default.create(fitnessPreference);
        return JSON.parse(JSON.stringify(newFitnessPreference));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.createFitnessPreference = createFitnessPreference;
// READ
const getPreferenceByUserIdAndPreferenceId = (userId, preferenceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const fitnessPreference = yield fitnessPreference_model_1.default.findOne({
            _id: preferenceId,
            userId,
        });
        return JSON.parse(JSON.stringify(fitnessPreference));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.getPreferenceByUserIdAndPreferenceId = getPreferenceByUserIdAndPreferenceId;
// UPDATE
const updatePreferenceByUserIdAndPreferencieId = (userId, preferenceId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const response = yield fitnessPreference_model_1.default.findOneAndUpdate({ _id: preferenceId, userId }, { $set: payload });
        if (!response)
            throw new Error("Fitness preference update failed");
        return JSON.parse(JSON.stringify(yield fitnessPreference_model_1.default.findById(preferenceId)));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.updatePreferenceByUserIdAndPreferencieId = updatePreferenceByUserIdAndPreferencieId;
// DELETE
const deletePreferenceByPreferencieId = (preferenceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const deletedPreference = yield fitnessPreference_model_1.default.findByIdAndDelete(preferenceId);
        return deletedPreference
            ? JSON.parse(JSON.stringify(deletedPreference))
            : null;
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.deletePreferenceByPreferencieId = deletePreferenceByPreferencieId;
