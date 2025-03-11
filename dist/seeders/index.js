"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Starting database seeding...");
            // create exercise categories
            yield seedExerciseCategories();
            // create muscle groups
            yield seedMuscleGroups();
            // create exercises
            yield seedExercises();
            // create test user
            const userId = yield seedTestUser();
            yield seedWorkoutPlans(userId);
            console.log("Database seeding completed successfully");
        }
        catch (error) {
            console.error("Error seeding database:", error);
            throw error;
        }
    });
}
function seedExerciseCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding exercise categories...");
        const categories = [
            { name: "Strength", description: "Exercises focused on building strength" },
            {
                name: "Cardio",
                description: "Exercises focused on cardiovascular fitness",
            },
            {
                name: "Flexibility",
                description: "Exercises focused on improving flexibility",
            },
            {
                name: "Balance",
                description: "Exercises focused on improving balance and stability",
            },
            {
                name: "Plyometric",
                description: "Explosive exercises that increase power",
            },
        ];
        for (const category of categories) {
            yield database_1.default.query("INSERT INTO exercise_categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING", [category.name, category.description]);
        }
    });
}
function seedMuscleGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding exercise muscle groups...");
        const muscleGroups = [
            { name: "Chest", description: "Pectoralis major and minor" },
            {
                name: "Back",
                description: "Latissimus dorsi, rhomboids, and trapezius",
            },
            { name: "Shoulders", description: "Deltoids" },
            { name: "Arms", description: "Biceps, triceps, and forearms" },
            { name: "Legs", description: "Quadriceps, hamstrings, and calves" },
            { name: "Core", description: "Abdominals and lower back" },
            {
                name: "Full Body",
                description: "Exercises that engage multiple muscle groups",
            },
        ];
        for (const muscleGroup of muscleGroups) {
            yield database_1.default.query("INSERT INTO muscle_groups (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING", [muscleGroup.name, muscleGroup.description]);
        }
    });
}
function seedExercises() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding exercises...");
        // Get category IDs
        const categoryResult = yield database_1.default.query("SELECT id, name FROM exercise_categories");
        const categories = categoryResult.rows.reduce((acc, curr) => {
            acc[curr.name] = curr.id;
            return acc;
        }, {});
        //  Get muscle groups IDs
        const muscleGroupResult = yield database_1.default.query("SELECT id, name FROM muscle_groups");
        const muscleGroups = muscleGroupResult.rows.reduce((acc, curr) => {
            acc[curr.name] = curr.id;
            return acc;
        }, {});
        const exercises = [
            {
                name: "Bench Press",
                description: "Lie on a bench and press weight upward",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Chest"],
                difficulty: "intermediate",
            },
            {
                name: "Squat",
                description: "Lower your body by bending your knees and then stand back up",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Legs"],
                difficulty: "intermediate",
            },
            {
                name: "Deadlift",
                description: "Lift a weight from the ground to hip level",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Back"],
                difficulty: "advanced",
            },
            {
                name: "Pull-up",
                description: "Pull your body up to a bar",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Back"],
                difficulty: "intermediate",
            },
            {
                name: "Push-up",
                description: "Lower and raise your body using your arms",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Chest"],
                difficulty: "beginner",
            },
            {
                name: "Treadmill Running",
                description: "Run on a treadmill",
                category_id: categories["Cardio"],
                muscle_group_id: muscleGroups["Legs"],
                difficulty: "beginner",
            },
            {
                name: "Jumping Jacks",
                description: "Jump while spreading arms and legs",
                category_id: categories["Cardio"],
                muscle_group_id: muscleGroups["Full Body"],
                difficulty: "beginner",
            },
            {
                name: "Plank",
                description: "Hold a position similar to a push-up",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Core"],
                difficulty: "beginner",
            },
            {
                name: "Bicep Curl",
                description: "Curl weight towards your shoulder",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Arms"],
                difficulty: "beginner",
            },
            {
                name: "Shoulder Press",
                description: "Press weight upward from shoulder height",
                category_id: categories["Strength"],
                muscle_group_id: muscleGroups["Shoulders"],
                difficulty: "intermediate",
            },
        ];
        for (const exercise of exercises) {
            yield database_1.default.query(`INSERT INTO exercises (name, description, category_id, muscle_group_id, difficulty)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name) DO NOTHING
        `, [
                exercise.name,
                exercise.description,
                exercise.category_id,
                exercise.muscle_group_id,
                exercise.difficulty,
            ]);
        }
    });
}
function seedTestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding test user...");
        // hash the password
        const password = yield bcryptjs_1.default.hash("password123", 10);
        // Insert the user
        const userResult = yield database_1.default.query(`INSERT INTO users 
     (username, email, password, first_name, last_name) 
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (username) DO UPDATE 
     SET email = $2, password = $3, first_name = $4, last_name = $5
     RETURNING id`, ["testuser", "test@example.com", password, "Test", "user"]);
        return userResult.rows[0].id;
    });
}
function seedWorkoutPlans(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Seeding workout plans...");
        // Create workout plans
        const workoutPlans = [
            {
                name: "Full Body Workout",
                description: "A complete workout targeting all major muscle groups",
                user_id: userId,
                level: "beginner",
                duration: 60,
                frequency: 3,
            },
            {
                name: "Upper Body Focus",
                description: "Targets chest, back, shoulders, and arms",
                user_id: userId,
                level: "intermediate",
                duration: 45,
                frequency: 2,
            },
            {
                name: "Lower Body Power",
                description: "Focuses on building strength in legs and core",
                user_id: userId,
                level: "intermediate",
                duration: 45,
                frequency: 2,
            },
        ];
        // Insert workout plans and their exercises
        for (const plan of workoutPlans) {
            // Insert the workout plan
            const planResult = yield database_1.default.query(`INSERT INTO workout_plans 
       (name, description, user_id, level, duration, frequency) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name, user_id) DO UPDATE 
       SET description = $2, level = $4, duration = $5, frequency = $6
       RETURNING id`, [
                plan.name,
                plan.description,
                plan.user_id,
                plan.level,
                plan.duration,
                plan.frequency,
            ]);
            const planId = planResult.rows[0].id;
            // Get exercises to add to the plan
            const exercisesResult = yield database_1.default.query("SELECT id, name FROM exercises LIMIT 5");
            const exercises = exercisesResult.rows;
            // Add exercises to the workout plan
            for (let i = 0; i < exercises.length; i++) {
                yield database_1.default.query(`INSERT INTO workout_exercises 
         (workout_plan_id, exercise_id, sets, reps, rest_time, order_index) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (workout_plan_id, exercise_id) DO UPDATE 
         SET sets = $3, reps = $4, rest_time = $5, order_index = $6`, [
                    planId,
                    exercises[i].id,
                    i % 2 === 0 ? 3 : 4, // Sets
                    i % 2 === 0 ? 10 : 12, // Reps
                    60, // Rest time in seconds
                    i + 1, // )rder index
                ]);
            }
            // Create a scheduled workout
            const today = new Date();
            const scheduledDate = new Date(today);
            scheduledDate.setDate(today.getDate() + 1); // Tomorrow
            yield database_1.default.query(`INSERT INTO scheduled_workouts 
       (workout_plan_id, user_id, scheduled_date, status) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`, [planId, userId, scheduledDate.toISOString(), "scheduled"]);
        }
    });
}
