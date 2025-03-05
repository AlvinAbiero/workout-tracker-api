import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";

describe("Authentication Controller", () => {
  beforeAll(async () => {
    // setup database connection or clear existing data
    await pool.query("DELETE FROM users");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "StrongPassword123!",
        first_name: "Test",
        last_name: "User",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.username).toBe("testuser");
    });

    it("should return 400 for duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send({
        username: "duplicateuser",
        email: "duplicate@example.com",
        password: "StrongPassword123!",
      });

      // Attempt duplicate registration
      const response = await request(app).post("/api/auth/register").send({
        username: "anotheruser",
        email: "duplicate@example.com",
        password: "AnotherStrongPassword123!",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/auth/login", () => {
    let token: string;
    beforeAll(async () => {
      // Ensure a test user exists
      await UserModel.create({
        username: "loginuser",
        email: "login@example.com",
        password: "ValidPassword123!",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "ValidPassword123!",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");

      token = generateToken(
        response.body.user.id,
        process.env.JWT_SECRET || "your-secret-key",
        "24h"
      );
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "WrongPassword",
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
