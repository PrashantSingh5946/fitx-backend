"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fitnessPreferenceSchema = new mongoose_1.Schema({
    goal: {
        type: String,
        enum: ["weightLoss", "weightGain", "endurance"],
        required: true,
    },
    dailyWaterIntakeGoal: { type: Number },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
const FitnessPreferenceModel = (mongoose_1.models === null || mongoose_1.models === void 0 ? void 0 : mongoose_1.models.FitnessPreference) ||
    (0, mongoose_1.model)("FitnessPreference", fitnessPreferenceSchema);
exports.default = FitnessPreferenceModel;
