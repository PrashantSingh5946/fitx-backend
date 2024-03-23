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
exports.deleteUser = exports.updateUser = exports.getUserByEmailId = exports.getUserById = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../database/models/user.model"));
const connectToDatabase = require("../database/mongoose");
const utils_1 = require("../utils");
// CREATE
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            const newUser = yield user_model_1.default.create(user);
            return JSON.parse(JSON.stringify(newUser));
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    });
}
exports.createUser = createUser;
// READ
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            const user = yield user_model_1.default.findById(userId);
            return JSON.parse(JSON.stringify(user));
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    });
}
exports.getUserById = getUserById;
// READ
function getUserByEmailId(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            const user = yield user_model_1.default.findOne({ email: email });
            return JSON.parse(JSON.stringify(user));
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    });
}
exports.getUserByEmailId = getUserByEmailId;
// UPDATE
function updateUser(userId, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, {
                $set: user,
            });
            if (!updatedUser)
                throw new Error("User update failed");
            return JSON.parse(JSON.stringify(yield user_model_1.default.findById(userId)));
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    });
}
exports.updateUser = updateUser;
// DELETE
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            // Find user to delete
            const userToDelete = yield user_model_1.default.findById(userId);
            if (!userToDelete) {
                throw new Error("User not found");
            }
            // Delete user
            const deletedUser = yield user_model_1.default.findByIdAndDelete(userId);
            return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    });
}
exports.deleteUser = deleteUser;
