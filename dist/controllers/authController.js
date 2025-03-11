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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.register = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, first_name, last_name } = req.body;
    const result = yield authService_1.AuthService.registerUser({
        username,
        email,
        password,
        first_name,
        last_name,
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
    });
}));
exports.login = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const result = yield authService_1.AuthService.loginUser({ username, password });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
    });
}));
exports.getProfile = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const user = yield authService_1.AuthService.getUserProfile(userId);
    res.status(200).json({
        success: true,
        data: user,
    });
}));
exports.updateProfile = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { first_name, last_name, email } = req.body;
    const updatedUser = yield authService_1.AuthService.updateUserProfile(userId, {
        first_name,
        last_name,
        email,
    });
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
}));
exports.changePassword = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;
    yield authService_1.AuthService.changePassword(userId, current_password, new_password);
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
}));
