"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    activityType: {
        type: String,
        enum: ["Food", "Water", "Workout", "Sleep"],
        required: true,
    },
    activityMeasurement: { type: Number, required: true },
    activityMeasurementUnit: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
}, { timestamps: true });
const ActivityModel = (mongoose_1.models === null || mongoose_1.models === void 0 ? void 0 : mongoose_1.models.Activity) || (0, mongoose_1.model)("Activity", activitySchema);
exports.default = ActivityModel;
