import request from "supertest";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import { WorkoutPlanModel } from "../src/models/WorkoutPlan";
import { generateToken } from "../src/utils/jwt";
import pool from "../src/config/database";
