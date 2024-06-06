"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_js_1 = __importDefault(require("../middleware/protectRoute.js"));
const authController_js_1 = require("../controllers/authController.js");
const router = express_1.default.Router();
router.get("/me", protectRoute_js_1.default, authController_js_1.getMe);
router.post("/signup", authController_js_1.signup);
router.post("/login", authController_js_1.login);
router.post("/logout", authController_js_1.logout);
exports.default = router;
