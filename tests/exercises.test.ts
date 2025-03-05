import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";

describe("Exercise Controler", () => {
  let authToken: string;
  let createdExerciseId: number;

  beforeAll(async () => {
    //  Create a test user and generate token
    const user = await UserModel.create({
      username: "exerciseuser",
      email: "exercise@example.com",
      password: "StrongPassword123!",
    });

    authToken = generateToken(user.id!, user.username, user.email);

    // seed some initial data
    await pool.query(`
            INSERT INTO exercise_categories (name, description)
            VALUES ('Strength', 'Strength training exercises')
            OM CONFLICT (name) DO NOTHING
            `);

    await pool.query(`
            INSERT INTO muscle_groups (name, description)
            VALUES ('Chest', 'Chest muscle group')
            OM CONFLICT (name) DO NOTHING
            `);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /api/exercises", () => {
    it("should create a new exercise", async () => {
      // First, get the category and muscle group IDs
      const categoryResult = await pool.query(
        "SELECT id FROM exercise_categories WHERE name = $1",
        ["Strength"]
      );
      const muscleGroupResult = await pool.query(
        "SELECT id FROM muscle_groups WHERE name = $1",
        ["Chest"]
      );

      const response = await request(app)
        .post("/api/exercises")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Bench Press",
          description: "A compound exercise for chest muscles",
          category_id: categoryResult.rows[0].id,
          muscle_group_id: muscleGroupResult.rows[0].id,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Bench Press");

      createdExerciseId = response.body.id;
    });

    it("should return 400 for invalid exercise data", async () => {
      const response = await request(app)
        .post("/api/exercises")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "",
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/exercises", () => {
    it("should retrieve all exercise", async () => {
      const response = await request(app)
        .get("/api/exercises")
        .set("Authorization", `Beare ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should retrieve a specific exercise by ID", async () => {
      const response = await request(app)
        .get(`/api/exercises/${createdExerciseId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(createdExerciseId);
      expect(response.body.name).toBe("Bench Press");
    });
  });

  describe("PUT /api/exercises/:id", () => {
    it("should update an existing exercise", async () => {
      const response = await request(app)
        .put(`/api/exercises/${createdExerciseId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Updated bench Press",
          description: "An updated description",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Updated Bench Press");
      expect(response.body.description).toBe("An updated description");
    });
  });

  describe("DELETE /api/exercises/:id", () => {
    it("should delete an exercise", async () => {
      const response = await request(app)
        .delete(`/api/exercises/${createdExerciseId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(204);
    });
  });
});
