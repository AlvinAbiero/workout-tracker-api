import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { ExerciseModel} from "../src/models/Exercise";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";

describe('Workout Plans Controller', () => {
    let authToken: string;
    let userId: number;
    let workoutPlanId: number;
    let exerciseId: number;

    beforeAll(async () => {
        // Create a test user
        const user = await UserModel.create({
             username: 'workoutplanuser',
             email: 'workoutplan@example.com',
            password: 'StrongPassword123!'
        })
    })
})