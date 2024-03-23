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
exports.checkAccessTokenValidity = exports.verifyGoogleToken = exports.handleError = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("./database/models/user.model"));
// ERROR HANDLER
const handleError = (error) => {
    if (error instanceof Error) {
        // This is a native JavaScript error (e.g., TypeError, RangeError)
        console.error(error.message);
        throw new Error(`Error: ${error.message}`);
    }
    else if (typeof error === "string") {
        // This is a string error message
        console.error(error);
        throw new Error(`Error: ${error}`);
    }
    else {
        // This is an unknown type of error
        console.error(error);
        throw new Error(`Unknown error: ${JSON.stringify(error)}`);
    }
};
exports.handleError = handleError;
function verifyGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    });
}
exports.verifyGoogleToken = verifyGoogleToken;
// function to check if a access token is valid
function checkAccessTokenValidity(accessToken_1, refreshToken_1, user_email_1) {
    return __awaiter(this, arguments, void 0, function* (accessToken, refreshToken, user_email, isRecursivelyCalled = false) {
        var _a, _b, _c, _d;
        try {
            const response = yield fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            const data = yield response.json();
            if (response.ok) {
                return data;
            }
            else {
                throw new Error(`Error: ${data.error}`);
            }
        }
        catch (error) {
            if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("invalid_token")) {
                //Refresh the token
                console.log("Refreshing the token");
                const user = new google_auth_library_1.UserRefreshClient(process.env.CLIENT_ID, process.env.CLIENT_SECRET, refreshToken);
                const { credentials } = yield user.refreshAccessToken();
                console.log("Token refreshed", credentials);
                const currentUser = yield user_model_1.default.findOne({ email: user_email });
                if (currentUser) {
                    currentUser.accessToken = (_b = credentials.access_token) !== null && _b !== void 0 ? _b : "";
                    currentUser.refreshToken = credentials.refresh_token;
                    yield currentUser.save();
                    if (!isRecursivelyCalled) {
                        checkAccessTokenValidity((_c = credentials.access_token) !== null && _c !== void 0 ? _c : "", (_d = credentials.refresh_token) !== null && _d !== void 0 ? _d : "", user_email, true);
                    }
                }
            }
            else {
                console.log("Error in checking token validity");
                console.log(error.message.indexOf("invalid_token"));
            }
            (0, exports.handleError)(error);
        }
    });
}
exports.checkAccessTokenValidity = checkAccessTokenValidity;
