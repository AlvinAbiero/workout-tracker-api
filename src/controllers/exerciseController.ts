import { Request, Response } from "express";
import { ExerciseService } from "../services/exerciseService";
import { catchAsync } from "../utils/asyncHandler";

export const getAllExercises = catchAsync(
  async (req: Request, res: Response) => {
    const exercises = await ExerciseService.getAllExercises();

    res.status(200).json({
      success: true,
      data: exercises,
    });
  }
);

export const getExerciseById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const exercise = await ExerciseService.getExerciseById(id);

    res.status(200).json({
      success: true,
      data: exercise,
    });
  }
);

export const createExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description, category_id, muscle_group_id } = req.body;

    const exercise = await ExerciseService.createExercise({
      name,
      description,
      category_id,
      muscle_group_id,
    });

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      data: exercise,
    });
  }
);

export const updateExercise = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, description, category_id, muscle_group_id } = req.body;

    const exercise = await ExerciseService.updateExercise(id, {
      name,
      description,
      category_id,
      muscle_group_id,
    });

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: exercise,
    });
  }
);

export const deleteExercise = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    await ExerciseService.deleteExercise(id);

    res.status(200).json({
      succes: true,
      message: "Exercise deleted successfully",
    });
  }
);

export const getExercisesByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);

    const exercises = await ExerciseService.getExercisesByCategory(categoryId);

    res.status(200).json({
      success: true,
      data: exercises,
    });
  }
);

export const getExercisesByMuscleGroup = catchAsync(
  async (req: Request, res: Response) => {
    const muscleGroupId = parseInt(req.params.muscleGroupId);

    const exercises = await ExerciseService.getExercisesByMuscleGroup(
      muscleGroupId
    );

    res.status(200).json({
      success: true,
      data: exercises,
    });
  }
);

export const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await ExerciseService.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  }
);

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    const category = await ExerciseService.createCategory({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Exercise category created successfully",
      data: category,
    });
  }
);

export const getAllMuscleGroups = catchAsync(
  async (req: Request, res: Response) => {
    const muscleGroups = await ExerciseService.getAllMuscleGroups();

    res.status(200).json({
      success: true,
      data: muscleGroups,
    });
  }
);

export const createMuscleGroup = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    const muscleGroup = await ExerciseService.createMuscleGroup({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Muscle group created successfully",
      data: muscleGroup,
    });
  }
);
