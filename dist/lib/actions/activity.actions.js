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
exports.deleteActivityById = exports.updateActivityByIdAndUserId = exports.getActivityByIdAndUserId = exports.createActivity = void 0;
const activity_model_1 = __importDefault(require("../database/models/activity.model"));
const connectToDatabase = require("../database/mongoose");
const utils_1 = require("../utils");
// CREATE
const createActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const newActivity = yield activity_model_1.default.create(activity);
        return JSON.parse(JSON.stringify(newActivity));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.createActivity = createActivity;
// READ
const getActivityByIdAndUserId = (userId, activityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const activity = yield activity_model_1.default.findOne({
            _id: activityId,
            userId,
        });
        return JSON.parse(JSON.stringify(activity));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.getActivityByIdAndUserId = getActivityByIdAndUserId;
// UPDATE
const updateActivityByIdAndUserId = (userId, activityId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const response = yield activity_model_1.default.findOneAndUpdate({ _id: activityId, userId }, { $set: payload });
        if (!response)
            throw new Error("Activity update failed");
        return JSON.parse(JSON.stringify(yield activity_model_1.default.findById(activityId)));
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.updateActivityByIdAndUserId = updateActivityByIdAndUserId;
// DELETE
const deleteActivityById = (activityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        const deletedactivity = yield activity_model_1.default.findByIdAndDelete(activityId);
        return deletedactivity ? JSON.parse(JSON.stringify(deletedactivity)) : null;
    }
    catch (error) {
        (0, utils_1.handleError)(error);
    }
});
exports.deleteActivityById = deleteActivityById;
