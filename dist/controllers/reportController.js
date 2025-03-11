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
exports.getMonthlyWorkoutStats = exports.getExerciseProgress = exports.getWorkoutSummary = void 0;
const reportService_1 = require("../services/reportService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getWorkoutSummary = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    const summary = yield reportService_1.ReportService.getWorkoutSummary(userId, startDateObj, endDateObj);
    res.status(200).json({
        success: true,
        data: summary
    });
}));
exports.getExerciseProgress = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const exerciseId = parseInt(req.params.exerciseId);
    const progress = yield reportService_1.ReportService.getExerciseProgress(userId, exerciseId);
    res.status(200).json({
        success: true,
        data: progress
    });
}));
exports.getMonthlyWorkoutStats = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { year, month } = req.query;
    const yearNum = parseInt(year);
    const monthNum = month ? parseInt(month) : undefined;
    if (isNaN(yearNum)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year parameter'
        });
    }
    if (month && isNaN(monthNum)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid month parameter'
        });
    }
    const stats = yield reportService_1.ReportService.getMonthlyWorkoutStats(userId, yearNum, monthNum);
    res.status(200).json({
        success: true,
        data: stats
    });
}));
