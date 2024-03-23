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
exports.deleteMeasurementById = exports.updateMeasurementByUserIdAndMeasurementId = exports.getMeasurementByUserIdAndMeasurementId = exports.createMeasurements = void 0;
const measurement_model_1 = __importDefault(require("../database/models/measurement.model"));
const connectToDatabase = require("../database/mongoose");
const utils_1 = require("../utils");
// CREATE
const createMeasurements = (measurements) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const newMeasurements = yield measurement_model_1.default.create(measurements);
        return JSON.parse(JSON.stringify(newMeasurements));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.createMeasurements = createMeasurements;
// READ
const getMeasurementByUserIdAndMeasurementId = (userId, measurementId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const measurements = yield measurement_model_1.default.findOne({
            _id: measurementId,
            userId,
        });
        return JSON.parse(JSON.stringify(measurements));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.getMeasurementByUserIdAndMeasurementId = getMeasurementByUserIdAndMeasurementId;
// UPDATE
const updateMeasurementByUserIdAndMeasurementId = (userId, measurementId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const response = yield measurement_model_1.default.findOneAndUpdate({ _id: measurementId, userId }, { $set: payload });
        if (!response)
            throw new Error("Measurement update failed");
        return JSON.parse(JSON.stringify(yield measurement_model_1.default.findById(measurementId)));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.updateMeasurementByUserIdAndMeasurementId = updateMeasurementByUserIdAndMeasurementId;
// DELETE
const deleteMeasurementById = (measurementId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const deletedMeasurement = yield measurement_model_1.default.findByIdAndDelete(measurementId);
        return deletedMeasurement
            ? JSON.parse(JSON.stringify(deletedMeasurement))
            : null;
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.deleteMeasurementById = deleteMeasurementById;
