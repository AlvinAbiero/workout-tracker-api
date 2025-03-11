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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const passwordUtils_1 = require("../utils/passwordUtils");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if username already exists
                const existingUsername = yield User_1.UserModel.findByUsername(userData.username);
                if (existingUsername) {
                    throw new Error("Username already exists");
                }
                // check if email already exist
                const existingEmail = yield User_1.UserModel.findByEmail(userData.email);
                if (existingEmail) {
                    throw new Error("Email already exists");
                }
                // Create new user
                const user = yield User_1.UserModel.create(userData);
                // Generate new user
                const token = (0, jwt_1.generateToken)(user.id, user.username, user.email);
                return { user, token };
            }
            catch (error) {
                throw error;
            }
        });
    }
    static loginUser(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user by username
                const user = yield User_1.UserModel.findByUsername(credentials.username);
                if (!user) {
                    throw new Error("Invalid credentials");
                }
                // Verify password
                const isPasswordValid = yield (0, passwordUtils_1.comparePassword)(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }
                // Generate JWT token
                const token = (0, jwt_1.generateToken)(user.id, user.username, user.email);
                // Remove password from user object
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return {
                    user: userWithoutPassword,
                    token,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.UserModel.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateUserProfile(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield User_1.UserModel.update(userId, userData);
                if (!updatedUser) {
                    throw new Error("Failed to update user profile");
                }
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  Get user with password
                const user = yield User_1.UserModel.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                // Verify current password
                const isPasswordValid = yield (0, passwordUtils_1.comparePassword)(currentPassword, user.password);
                if (!isPasswordValid) {
                    throw new Error("Current password is incorrect");
                }
                // Update password
                const updated = yield User_1.UserModel.updatePassword(userId, newPassword);
                if (!updated) {
                    throw new Error("Failed to update password");
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AuthService = AuthService;
