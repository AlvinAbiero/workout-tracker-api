import { ScheduledWorkoutModel } from "../models/ScheduledWorkout";

interface WorkoutSummary {
  totalWorkouts: number;
  completedWorkouts: number;
  cancelledWorkouts: number;
  completionRate: number;
}

interface ExerciseProgress {
  exerciseId: number;
  exerciseName: string;
  logs: Array<object>;
}

export class ReportService {
  static async getWorkoutSummary(
    userId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<WorkoutSummary> {
    try {
      // Get all workouts
      const allWorkouts = await ScheduledWorkoutModel.findAllByUser(
        userId,
        undefined,
        startDate,
        endDate
      );

      // Count totals
      const totalWorkouts = allWorkouts.length;
      const completedWorkouts = allWorkouts.filter(
        (w) => w.status === "completed"
      ).length;
      const cancelledWorkouts = allWorkouts.filter(
        (w) => w.status === "cancelled"
      ).length;

      // Calculate completion rate
      const completionRate =
        totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

      return {
        totalWorkouts,
        completedWorkouts,
        cancelledWorkouts,
        completionRate,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getExerciseProgress(
    userId: number,
    exerciseId: number
  ): Promise<ExerciseProgress> {
    try {
      // Get all logs for this exercise
      const logs = await ScheduledWorkoutModel.getUserProgressByExercise(
        userId,
        exerciseId
      );

      if (logs.length === 0) {
        throw new Error("No progress data found for this exercise");
      }

      // Format the data
      return {
        exerciseId,
        exerciseName: logs[0].exercise_name,
        logs: logs.map((log) => ({
          date: log.completed_date,
          sets: log.sets,
          reps: log.reps,
          weight: log.weight || 0,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  static async getMonthlyWorkoutStats(
    userId: number,
    year: number,
    month?: number
  ): Promise<any[]> {
    try {
      // Calculate date range
      let startDate, endDate;

      if (month) {
        // Get data for specific month
        startDate = new Date(year, month - 1, 1); // Month is 0-indexed
        endDate = new Date(year, month, 0); // Last day of month
      } else {
        // Get data for entire year
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31);
      }

      // Get all workouts in date range
      const workouts = await ScheduledWorkoutModel.findAllByUser(
        userId,
        undefined,
        startDate,
        endDate
      );

      // Process and aggregate data
      // This is a simple example - you can enhance this with more detailed stats
      const monthlyData = Array(month ? 1 : 12)
        .fill(0)
        .map((_, i) => {
          const monthIndex = month ? month - 1 : i;
          const monthName = new Date(year, monthIndex, 1).toLocaleString(
            "default",
            { month: "long" }
          );

          const monthWorkouts = workouts.filter((w) => {
            const workoutDate = new Date(w.scheduled_date);
            return workoutDate.getMonth() === monthIndex;
          });

          const completed = monthWorkouts.filter(
            (w) => w.status === "completed"
          ).length;
          const scheduled = monthWorkouts.filter(
            (w) => w.status === "scheduled"
          ).length;
          const cancelled = monthWorkouts.filter(
            (w) => w.status === "cancelled"
          ).length;

          return {
            month: monthName,
            total: monthWorkouts.length,
            completed,
            scheduled,
            cancelled,
            completionRate:
              monthWorkouts.length > 0
                ? (completed / monthWorkouts.length) * 100
                : 0,
          };
        });

      return monthlyData;
    } catch (error) {
      throw error;
    }
  }
}
