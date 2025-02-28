import { Request, Response } from "express";
import { WorkoutService } from "../services/workoutService";
import { catchAsync } from "../utils/asyncHandler";

export const createWorkoutPlan = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { name, description } = req.body;

    const workoutPlan = await WorkoutService.createWorkoutPlan({
      user_id: userId,
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      data: workoutPlan,
    });
  }
);

export const getWorkoutPlanById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;

    const workoutPlan = await WorkoutService.getWorkoutPlanById(id, userId);

    res.status(200).json({
      success: true,
      data: workoutPlan,
    });
  }
);

export const getUserWorkoutPlans = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const workoutPlans = await WorkoutService.getUserWorkoutPlans(userId);

    res.status(200).json({
      success: true,
      data: workoutPlans,
    });
  }
);

export const updateWorkoutPlan = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const workoutPlan = await WorkoutService.updateWorkoutPlan(id, userId, {
      name,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Workout plan updated successfully",
      data: workoutPlan,
    });
  }
);

export const deleteWorkoutPlan = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;

    await WorkoutService.deleteWorkoutPlan(id, userId);

    res.status(200).json({
      success: true,
      message: "Workout plan deleted successfully",
    });
  }
);

export const addExerciseToWorkout = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const exerciseData = req.body;

    const exercise = await WorkoutService.addExerciseToWorkout(
      userId,
      exerciseData
    );

    res.status(201).json({
      success: true,
      message: "Exercise added to workout plan successfully",
      data: exercise,
    });
  }
);

export const updateWorkoutExercise = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    const exerciseData = req.body;

    const updatedExercise = await WorkoutService.updateWorkoutExercise(
      id,
      userId,
      exerciseData
    );

    res.status(200).json({
      success: true,
      message: "Workout exercise update successfully",
      data: updatedExercise,
    });
  }
);

export const removeExerciseFromWorkout = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    const workoutPlanId = parseInt(req.params.workoutPlanId);

    await WorkoutService.removeExerciseFromWorkout(id, userId, workoutPlanId);

    res.status(200).json({
      success: true,
      message: "Exercise removed from workout plan successfully",
    });
  }
);

export const scheduleWorkout = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { workout_plan_id, scheduled_date } = req.body;
    const scheduledWorkout = await WorkoutService.scheduleWorkout({
      user_id: userId,
      workout_plan_id,
      scheduled_date: new Date(scheduled_date),
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Workout scheduled successfully",
      data: scheduledWorkout,
    });
  }
);

export const getScheduledWorkoutById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);

    const scheduledWorkout = await WorkoutService.getScheduledWorkoutById(
      id,
      userId
    );

    res.status(200).json({
      success: true,
      data: scheduledWorkout,
    });
  }
);

export const getUserScheduledWorkouts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, startDate, endDate } = req.query;

    const startDateObj = startDate ? new Date(startDate as string) : undefined;
    const endDateObj = endDate ? new Date(endDate as string) : undefined;

    const scheduledWorkouts = await WorkoutService.getUserScheduledWorkouts(
      userId,
      status as string | undefined,
      startDateObj,
      endDateObj
    );

    res.status(200).json({
      success: true,
      data: scheduledWorkouts,
    });
  }
);

export const getUpcomingWorkouts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const upcomingWorkouts = await WorkoutService.getUpcomingWorkouts(userId);

    res.status(200).json({
      success: true,
      data: upcomingWorkouts,
    });
  }
);
