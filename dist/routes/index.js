"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const exerciseRoutes_1 = __importDefault(require("./exerciseRoutes"));
const workoutRoutes_1 = __importDefault(require("./workoutRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const router = (0, express_1.Router)();
// Mount all routes
router.use('/auth', authRoutes_1.default);
router.use('/exercises', exerciseRoutes_1.default);
router.use('/workouts', workoutRoutes_1.default);
router.use('/reports', reportRoutes_1.default);
exports.default = router;
