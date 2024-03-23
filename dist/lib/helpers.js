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
exports.heartDataFetcher = void 0;
const axios_1 = __importDefault(require("axios"));
const heartDataFetcher = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    let data = JSON.stringify({
        aggregateBy: [
            {
                dataTypeName: "com.google.heart_rate.summary",
                dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
            },
        ],
        bucketByTime: {
            durationMillis: 60000,
        },
        startTimeMillis: new Date().getTime() - 24 * 60 * 60 * 1000,
        endTimeMillis: new Date().getTime(),
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        data: data,
    };
    let responseData = [0];
    return new Promise((resolve, reject) => {
        axios_1.default
            .request(config)
            .then((response) => {
            let bucket = response.data.bucket;
            let rawData = bucket
                .map((minute) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    y: ((_c = (_b = (_a = minute.dataset[0]) === null || _a === void 0 ? void 0 : _a.point[0]) === null || _b === void 0 ? void 0 : _b.value[0]) === null || _c === void 0 ? void 0 : _c.fpVal)
                        ? (_f = (_e = (_d = minute.dataset[0]) === null || _d === void 0 ? void 0 : _d.point[0]) === null || _e === void 0 ? void 0 : _e.value[0]) === null || _f === void 0 ? void 0 : _f.fpVal
                        : null,
                    x: new Date(parseInt(minute.startTimeMillis)),
                };
            })
                .filter((dataset) => dataset.y);
            resolve(rawData);
        })
            .catch((error) => {
            reject(error);
        });
    });
});
exports.heartDataFetcher = heartDataFetcher;
