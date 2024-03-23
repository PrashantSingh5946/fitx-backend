"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const measurementSchema = new mongoose_1.Schema({
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    measurementUnit: { type: String, required: true },
    bmi: { type: Number, required: true },
    bmr: { type: Number, required: true },
    maintenanceCalories: { type: Number, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const MeasurementModel = (mongoose_1.models === null || mongoose_1.models === void 0 ? void 0 : mongoose_1.models.Measurement) || (0, mongoose_1.model)("Measurement", measurementSchema);
exports.default = MeasurementModel;
