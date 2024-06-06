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
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../db/prisma"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = yield prisma_1.default.user.create({
            data: {
                fullname,
                username,
                password: hashPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProilePic
            }
        });
        if (newUser) {
            (0, generateToken_1.default)(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isCorrectPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        (0, generateToken_1.default)(user.id, res);
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.logout = logout;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMe = getMe;
