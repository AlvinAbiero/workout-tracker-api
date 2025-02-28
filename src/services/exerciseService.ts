import {
  Exercise,
  ExerciseModel,
  ExerciseCategory,
  ExerciseWithDetails,
  MuscleGroup,
} from "../models/Exercise";

export class ExerciseService {
  static async getAllExercises() {
    try {
      return await ExerciseModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getExerciseById(id: number) {
    try {
      const exercise = await ExerciseModel.findById(id);
      if (!exercise) {
        throw new Error("Exercise not found");
      }

      return exercise;
    } catch (error) {
      throw error;
    }
  }

  static async createExercise(exerciseData: Exercise) {
    try {
      return await ExerciseModel.create(exerciseData);
    } catch (error) {
      throw error;
    }
  }

  static async updateExercise(id: number, exerciseData: Partial<Exercise>) {
    try {
      const updatedExercise = await ExerciseModel.update(id, exerciseData);
      if (!updatedExercise) {
        throw new Error("Exercise not found");
      }

      return updatedExercise;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExercise(id: number) {
    try {
      const deleted = await ExerciseModel.delete(id);
      if (!deleted) {
        throw new Error("Exercise not found");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getExercisesByCategory(categoryId: number) {
    try {
      return await ExerciseModel.findByCategory(categoryId);
    } catch (error) {
      throw error;
    }
  }

  static async getExercisesByMuscleGroup(muscleGroupId: number) {
    try {
      return await ExerciseModel.findById(muscleGroupId);
    } catch (error) {
      throw error;
    }
  }

  //   Categories
  static async getAllCategories() {
    try {
      return await ExerciseModel.getAllCategories();
    } catch (error) {
      throw error;
    }
  }

  static async createCategory(categoryData: ExerciseCategory) {
    try {
      return await ExerciseModel.createCategory(categoryData);
    } catch (error) {
      throw error;
    }
  }

  // Muscle Groups
  static async getAllMuscleGroups() {
    try {
      return await ExerciseModel.getAllMuscleGroups();
    } catch (error) {
      throw error;
    }
  }

  static async createMuscleGroup(muscleGroupData: MuscleGroup) {
    try {
      return await ExerciseModel.create(muscleGroupData);
    } catch (error) {
      throw error;
    }
  }
}
