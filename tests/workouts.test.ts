import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { ExerciseModel } from "../src/models/Exercise";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";

describe("Workout Plans Controller", () => {
  let authToken: string;
  let userId: number;
  let workoutPlanId: number;
  let exerciseId: number;

  beforeAll(async () => {
    // Create a test user
    const user = await UserModel.create({
      username: "workoutplanuser",
      email: "workoutplan@example.com",
      password: "StrongPassword123!",
    });

    userId = user.id!;
    authToken = generateToken(userId, user.username, user.email);

    // create a test exercise
    const categoryResult = await pool.query(
      "SELECT id FROM exercise_categories LIMIT 1"
    );
    const muscleGroupResult = await pool.query(
      "SELECT id FROM muscle_groups LIMIT 1"
    );

    const exercise = await ExerciseModel.create({
      name: "Test Exercise",
      description: "An exercise for testing workout plans",
      category_id: categoryResult.rows[0].id,
      muscle_group_id: muscleGroupResult.rows[0].id,
    });

    exerciseId = exercise.id!;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /api/workouts/plans", () => {});
});
