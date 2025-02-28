import {
  WorkoutPlanModel,
  WorkoutPlan,
  WorkoutExercise,
} from "../models/WorkoutPlan";

import {
  ScheduledWorkoutModel,
  ScheduledWorkout,
  WorkoutLog,
  CompletedWorkoutWithLogs,
} from "../models/ScheduledWorkout";

export class WorkoutService {
  // Workout Plans
  static async createWorkoutPlan(
    workoutData: WorkoutPlan
  ): Promise<WorkoutPlan> {
    try {
      return await WorkoutPlanModel.create(workoutData);
    } catch (error) {
      throw error;
    }
  }

  static async getWorkoutPlanById(
    id: number,
    userId: number
  ): Promise<WorkoutPlan> {
    try {
      const workout = await WorkoutPlanModel.findById(id);
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      // Check if workout belongs to user
      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to access this workout plan");
      }

      return workout;
    } catch (error) {
      throw error;
    }
  }

  static async getuserWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    try {
      return await WorkoutPlanModel.findAllByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  static async updateWorkoutPlan(
    id: number,
    userId: number,
    workoutData: Partial<WorkoutPlan>
  ): Promise<WorkoutPlan> {
    try {
      // check if workout exists and belongs to user
      const workout = await WorkoutPlanModel.findById(id);
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to modify this workout plan");
      }

      // Update workout
      const updatedWorkout = await WorkoutPlanModel.update(id, workoutData);
      if (!updatedWorkout) {
        throw new Error("Failed to update workout plan");
      }

      return updatedWorkout;
    } catch (error) {
      throw error;
    }
  }

  static async deleteWorkoutPlan(
    id: number,
    userId: number
  ): Promise<boolean | void> {
    try {
      // check if workout exists and belongs to user
      const workout = await WorkoutPlanModel.findById(id);
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to delete this workout plan");
      }

      // Delete workout
      return await WorkoutPlanModel.delete(id);
    } catch (error) {
      throw error;
    }
  }

  //  Workout Exercises
  static async addExerciseToWorkout(
    userId: number,
    exerciseData: WorkoutExercise
  ): Promise<WorkoutExercise> {
    try {
      // Check if workout exists and belongs to user
      const workout = await WorkoutPlanModel.findById(
        exerciseData.workout_plan_id
      );
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to modify this workout plan");
      }

      // Add exercise to workout
      return await WorkoutPlanModel.addExercise(exerciseData);
    } catch (error) {
      throw error;
    }
  }

  static async updateWorkoutExercise(
    id: number,
    userId: number,
    exerciseData: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise> {
    try {
      // get the workout exercise
      const exercises = await WorkoutPlanModel.getWorkoutExercises(
        exerciseData.workout_plan_id!
      );
      const exercise = exercises.find((e) => e.id === id);

      if (!exercise) {
        throw new Error("Workout exercise not found");
      }

      //    Check if workout belongs to user
      const workout = await WorkoutPlanModel.findById(exercise.workout_plan_id);
      if (!workout || workout.user_id !== userId) {
        throw new Error("You are not authorized to modify this workout plan");
      }

      //   update exercise
      const updatedExercise = await WorkoutPlanModel.updateExercise(
        id,
        exerciseData
      );
      if (!updatedExercise) {
        throw new Error("Failed to update workout exercise");
      }

      return updatedExercise;
    } catch (error) {
      throw error;
    }
  }

  static async removeExerciseFromWorkout(
    id: number,
    userId: number,
    workoutPlanId: number
  ): Promise<boolean | void> {
    try {
      // check if workout exists and belongs to user
      const workout = await WorkoutPlanModel.findById(workoutPlanId);
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to modify this workout plan");
      }

      // Remove exercise
      return await WorkoutPlanModel.removeExercise(id);
    } catch (error) {
      throw error;
    }
  }

  //   Scheduled workouts
  static async scheduleWorkout(
    workoutData: ScheduledWorkout
  ): Promise<ScheduledWorkout> {
    try {
      // Check if workout exists and belongs to user
      const workout = await WorkoutPlanModel.findById(
        workoutData.workout_plan_id
      );
      if (!workout) {
        throw new Error("Workout plan not found");
      }

      if (workout.user_id !== workoutData.user_id) {
        throw new Error("You are not authorized to schedule this workout plan");
      }

      // Scheduled workout
      return await ScheduledWorkoutModel.create(workoutData);
    } catch (error) {
      throw error;
    }
  }

  static async getScheduledWorkoutById(
    id: number,
    userId: number
  ): Promise<ScheduledWorkout> {
    try {
      const workout = await ScheduledWorkoutModel.findById(id);
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      // Check if workout belongs to user
      if (workout.user_id !== userId) {
        throw new Error(
          "You are not authorized to access this scheduled workout"
        );
      }

      return workout;
    } catch (error) {
      throw error;
    }
  }

  static async getUserScheduledWorkouts(
    userId: number,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScheduledWorkout[]> {
    try {
      return await ScheduledWorkoutModel.findAllByUser(
        userId,
        status,
        startDate,
        endDate
      );
    } catch (error) {
      throw error;
    }
  }

  static async getUpcomingWorkouts(
    userId: number
  ): Promise<ScheduledWorkout[]> {
    try {
      return await ScheduledWorkoutModel.getUpcomingWorkouts(userId);
    } catch (error) {
      throw error;
    }
  }

  static async updateScheduledWorkout(
    id: number,
    userId: number,
    workoutData: Partial<ScheduledWorkout>
  ): Promise<ScheduledWorkout> {
    try {
      // Check if scheduled workout exists and belongs to user
      const workout = await ScheduledWorkoutModel.findById(id);
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      if (workout.user_id !== userId) {
        throw new Error(
          "You are not authorized to modify this scheduled workout"
        );
      }

      // Update scheduled workout
      const updatedWorkout = await ScheduledWorkoutModel.update(
        id,
        workoutData
      );
      if (!updatedWorkout) {
        throw new Error("Failed to update scheduled workout");
      }

      return updatedWorkout;
    } catch (error) {
      throw error;
    }
  }

  static async completeWorkout(
    id: number,
    userId: number,
    completedDate: Date,
    comments?: string
  ): Promise<ScheduledWorkout> {
    try {
      // Check if scheduled workout exists and belongs to user
      const workout = await ScheduledWorkoutModel.findById(id);
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      if (workout.user_id !== userId) {
        throw new Error(
          "You are not authorized to modify this scheduled workout"
        );
      }

      // Mark workout as complete
      const updatedWorkout = await ScheduledWorkoutModel.markAsComplete(
        id,
        completedDate,
        comments
      );
      if (!updatedWorkout) {
        throw new Error("Failed to complete workout");
      }

      return updatedWorkout;
    } catch (error) {
      throw error;
    }
  }

  static async deleteScheduledWorkout(
    id: number,
    userId: number
  ): Promise<boolean | void> {
    try {
      // Check if scheduled workout exists and belongs to user
      const workout = await ScheduledWorkoutModel.findById(id);
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      if (workout.user_id !== userId) {
        throw new Error(
          "You are not authorized to delete this scheduled workout"
        );
      }

      // Delete scheduled workout
      return await ScheduledWorkoutModel.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Workout Logs
  static async logWorkoutExercise(logData: WorkoutLog): Promise<WorkoutLog> {
    try {
      // Check if scheduled workout exists and belongs to user
      const workout = await ScheduledWorkoutModel.findById(
        logData.scheduled_workout_id
      );
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      // Add workout log
      return await ScheduledWorkoutModel.addWorkoutLog(logData);
    } catch (error) {
      throw error;
    }
  }

  static async getWorkoutLogs(
    scheduledWorkoutId: number,
    userId: number
  ): Promise<WorkoutLog[]> {
    try {
      // Check if scheduled workout exists and belongs to user
      const workout = await ScheduledWorkoutModel.findById(scheduledWorkoutId);
      if (!workout) {
        throw new Error("Scheduled workout not found");
      }

      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to access these workout logs");
      }

      // Get workout logs
      return await ScheduledWorkoutModel.getWorkoutLogs(scheduledWorkoutId);
    } catch (error) {
      throw error;
    }
  }

  static async getCompletedWorkoutWithLogs(
    workoutId: number,
    userId: number
  ): Promise<CompletedWorkoutWithLogs> {
    try {
      // Get completed workout with logs
      const workout = await ScheduledWorkoutModel.getCompletedWorkoutWithLogs(
        workoutId
      );
      if (!workout) {
        throw new Error("Completed workout not found");
      }

      // Check if workout belongs to user
      if (workout.user_id !== userId) {
        throw new Error("You are not authorized to access this workout");
      }

      return workout;
    } catch (error) {
      throw error;
    }
  }
}
