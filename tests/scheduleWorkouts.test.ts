import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { WorkoutPlanModel } from "../src/models/WorkoutPlan";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";


describe('Scheduled Workouts Controller', () => {
    let authToken: string;
    let userId: number;
    let workoutPlanId: number;
    let scheduledWorkoutId: number;


    beforeAll(async () => {
        // Create a test user
        const user = await UserModel.create({
            username: 'scheduledworkoutuser',
            email: 'scheduleworkout@example.com',
            password: 'StrongPassword123!'
        })
        userId = user.id!;
        authToken = generateToken(user);

        // Create a test workout plan
        const workoutPlan = await WorkoutPlanModel.create({
            user_id: userId,
            name: 'Test Workout Plan',
            description: 'A plan for testing scheduled workouts'
        });
        workoutPlanId = workoutPlan.id;
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('POST /api/workouts/schedule', () => {
        it('should schedule a new workout', async () => {
            const response = await request(app)
                .post('/api/workouts/schedule')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    workout_plan_id: workoutPlanId,
                    scheduled_date: new Date().toISOString(),
                    status: 'scheduled',
                    comments: 'Test scheduled workout'
                });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.workout_plan_id).toBe(workoutPlanId);

            schdeuledWorkoutId = response.body.id
        })

        it('should return 400 for invalid scheduled workout data', async () => {
            const response = await request(app)
                .post('/api/workouts/schedule')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing required fields
                    workout_plan_id: null
                })

            expect(response.statusCode).toBe(400)
        })
    })

    describe('GET /api/workouts/scheduled', () => {
        it('should retrieve user\'s scheduled workouts', async () => {
            const response = await request(app)
                .get('/api/workouts/scheduled')
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true)
        })

        it('should retrieve a specific scheduled workout', async () => {
            const response = await request(app)
                .get(`/api/workouts/scheduled/${scheduledWorkoutId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(scheduledWorkoutId)
        })
    })

    describe('PUT /api/workouts/scheduled/:id', () => {
        it('should update a scheduled workout', async () => {
            const response = await request(app)
                .put(`/api/workouts/scheduled/${scheduledWorkoutId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'completed',
                    completed_date: new Date().toISOString(),
                    comments: 'Workout completed successfully'
                })

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('completed')
        })
    })

    describe('DELETE /api/workouts/scheduled/:id', () => {
        it('should delete a scheduled workout', async () => {
            const response = await request(app)
                .delete(`/api/workouts/scheduled/${scheduledWorkoutId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.statusCode).toBe(204)
        })
    })

})