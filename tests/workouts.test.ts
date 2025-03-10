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

  describe("POST /api/workouts/plans", () => {
    it("should create a new workout plan", async () => {
      const response = await request(app)
        .post("/api/workouts/plans")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Full Body Workout",
          description: "A comprehensive full body workout plan",
          exercise: [
            {
              exercise_id: exerciseId,
              sets: 3,
              reps: 12,
              weight: 50,
              notes: "Moderate intensity",
              order_index: 1,
            },
          ],
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Full Body Workout");

      workoutPlanId = response.body.id;
    });

    it("should return 400 for invalid workout plan data", async () => {
      const response = await request(app)
        .post("/api/workouts/plans")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          // Missing  required fields
          description: "Invalid workout plan",
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/workouts/plans", () => {
    it("should retrieve user's workout plans", async () => {
      const response = await request(app)
        .get("/api/workouts/api")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body));
    });

    it("should retrieve a specific workout plan", async () => {
      const response = await request(app)
        .get(`/api/workouts/plans/${workoutPlanId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(workoutPlanId);
      expect(response.body).toHaveProperty("exercises");
    });
  });

  describe("PUT /api/workouts/plans/:id", () => {
    it("should update a workout plan", async () => {
      const response = await request(app)
        .put(`/api/workouts/plans/${workoutPlanId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Updated Full Body Workout",
          description: "An updated comprehensive full body workout plan",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Updated Full Body Workout");
    });

    it("should add an exercise to a workout plan", async () => {
      const response = await request(app).post(
        `/api/workouts/plans/${workoutPlanId}`
      );
    });
  });
});
