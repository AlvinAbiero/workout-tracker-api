import {Request, Response} from 'express'
import { ReportService} from '../services/reportService'
import { catchAsync } from '../utils/asyncHandler'

export const getWorkoutSummary = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { startDate, endDate} = req.query;

    const startDateObj = startDate ? new Date(startDate as string) : undefined;
    const endDateObj  = endDate ? new Date(endDate as string) : undefined;

    const summary = await ReportService.getWorkoutSummary(userId, startDateObj, endDateObj);

    res.status(200).json({
        success: true,
        data: summary
    })
})


export const getExerciseProgress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const exerciseId = parseInt(req.params.exerciseId);

    const progress = await ReportService.getExerciseProgress(userId, exerciseId);

    res.status(200).json({
        success: true,
        data: progress
    })
})

export const getMonthlyWorkoutStats = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const {year, month} = req.query;

    const yearNum = parseInt(year as string)
    const monthNum = month ? parseInt(month as string) : undefined;

    if (isNaN(yearNum)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year parameter'
        })
    }

    if (month && isNaN(monthNum as number)) {
         return res.status(400).json({
            success: false,
            message: 'Invalid month parameter'
        })
    }

    const stats = await ReportService.getMonthlyWorkoutStats(userId, yearNum, monthNum);

    res.status(200).json({
        success: true,
        data: stats
    })
})