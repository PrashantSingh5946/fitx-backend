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
const axios_1 = __importDefault(require("axios"));
const google_auth_library_1 = require("google-auth-library");
const express = require("express");
const user_model_1 = __importDefault(require("../lib/database/models/user.model"));
const utils_1 = require("../lib/utils");
const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
// middleware that is specific to this router
const timeLog = (req, res, next) => {
    console.log("Time: ", Date.now());
    next();
};
router.use(timeLog);
// define the home page route
router.get("/", (req, res) => {
    res.send("No route matches");
});
// define the about route
router.get("/about", (req, res) => {
    res.send("About birds");
});
//Authorization code flow
router.post("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Onboard the user through authorization code
    try {
        const tokens = yield axios_1.default.post("https://oauth2.googleapis.com/token", {
            code: req.body.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: "postmessage",
            grant_type: "authorization_code",
        });
        //Decode the token and store the user in the database
        let refreshToken = tokens.data.refresh_token;
        let accessToken = tokens.data.access_token;
        let idToken = tokens.data.id_token;
        //Decode the token and store the user in the database
        let { email, email_verified, name: fullName, given_name: firstName, family_name: lastName, } = JSON.parse(atob(idToken.split(".")[1]));
        //Check if the user exists in the database
        let user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            user = yield user_model_1.default.create({
                email,
                firstName,
                lastName,
                accessToken,
                refreshToken,
                avatar: "",
                email_verified,
                fullName,
            });
        }
        res.send(tokens.data);
    }
    catch (err) {
        res.send(JSON.stringify(err)).status(500);
    }
}));
//Refresh token code flow
router.post("/google/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.refreshToken) {
            const user = new google_auth_library_1.UserRefreshClient(process.env.CLIENT_ID, process.env.CLIENT_SECRET, req.body.refreshToken);
            const { credentials } = yield user.refreshAccessToken(); // optain new tokens
            res.json(credentials);
        }
        else {
            res.send("Invalid request");
        }
    }
    catch (err) {
        res.send(JSON.stringify(err.message));
    }
}));
//Verify the google login token and send the refresh token and access token
router.post("/google/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.token);
    try {
        if (req.body.token) {
            const response = yield (0, utils_1.verifyGoogleToken)(req.body.token);
            //Valid token received, so issue the access token and refresh token
            const { email } = response.payload;
            let user = yield user_model_1.default.findOne({ email });
            if (user) {
                res.json({
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                });
            }
            else {
                res.json({ shouldAuthorise: true });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
}));
//Route to check if the user exists, for auto login
router.post("/user/exists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        res.json({ exists: !!user });
    }
    catch (err) {
        res.send(JSON.stringify(err)).status(500);
    }
}));
module.exports = router;
