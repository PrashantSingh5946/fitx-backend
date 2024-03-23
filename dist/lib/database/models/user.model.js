"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    fullName: { type: String },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },
    avatar: { type: String, required: false },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
}, { timestamps: true });
const UserModel = (mongoose_1.models === null || mongoose_1.models === void 0 ? void 0 : mongoose_1.models.User) || (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
