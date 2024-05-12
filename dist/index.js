"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Telebirr = void 0;
const crypto = __importStar(require("crypto"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const axios_1 = __importDefault(require("axios"));
const TELEBIRR_H5_URL = "https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeWebPay";
const TELEBIRR_IN_APP_URL = "https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeMobilePay";
class Telebirr {
    constructor({ appId, appKey, shortCode, publicKey }) {
        this.appId = appId;
        this.appKey = appKey;
        this.shortCode = shortCode;
        this.publicKey = publicKey;
    }
    makePayment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { paymentMethod = "web", nonce, notifyUrl, totalAmount, outTradeNo, receiveName, returnApp = "com.example.app", returnUrl, subject, timeoutExpress = `${24 * 60}`, // 1 day
             } = options;
            const params = {
                appId: this.appId,
                appKey: this.appKey,
                nonce,
                notifyUrl,
                outTradeNo,
                receiveName,
                returnApp,
                returnUrl,
                shortCode: this.shortCode,
                subject,
                timeoutExpress,
                timestamp: new Date().getTime(),
                totalAmount,
            };
            const url = paymentMethod === "app" ? TELEBIRR_IN_APP_URL : TELEBIRR_H5_URL;
            const payload = {
                appid: this.appId,
                sign: this.signData(params),
                ussd: this.encrypt(params),
            };
            try {
                const res = yield axios_1.default.post(url, payload);
                return { success: res.data.code === 200, response: res.data };
            }
            catch (e) {
                console.log(e);
                return { success: false, error: e };
            }
        });
    }
    encrypt(payload) {
        const rsaKey = new node_rsa_1.default(`-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`, "public", {
            encryptionScheme: "pkcs1",
        });
        const dataToEncrypt = Buffer.from(JSON.stringify(payload));
        return rsaKey.encrypt(dataToEncrypt, "base64", "utf8");
    }
    signData(fields) {
        const encodedFields = Object.keys(fields)
            .sort()
            .map((key) => `${key}=${fields[key]}`)
            .join("&");
        return crypto.createHash("sha256").update(encodedFields).digest("hex");
    }
    decryptPublic(dataToDecrypt) {
        const rsaKey = new node_rsa_1.default(`-----BEGIN PUBLIC KEY-----\n${this.publicKey}\n-----END PUBLIC KEY-----`, "public", {
            encryptionScheme: "pkcs1",
        });
        return rsaKey.decryptPublic(dataToDecrypt, "utf8");
    }
    getDecryptedCallbackNotification(encryptedText) {
        const decryptedText = this.decryptPublic(encryptedText);
        return JSON.parse(decryptedText);
    }
}
exports.Telebirr = Telebirr;
