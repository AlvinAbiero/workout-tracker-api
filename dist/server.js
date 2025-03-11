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
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const seeders_1 = require("./seeders");
const config_1 = __importDefault(require("./config/config"));
const PORT = config_1.default.PORT;
function checkDbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.query("SELECT NOW()");
            console.log("Database connection successful");
            return true;
        }
        catch (error) {
            console.error("Databse connection failed:", error);
            return false;
        }
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check database connection
            const dbConnected = yield checkDbConnection();
            if (!dbConnected) {
                console.error("Unable to connect to the database. Exiting application.");
                process.exit(1);
            }
            // Seed the database if in development mode
            if (config_1.default.NODE_ENV === "development") {
                try {
                    yield (0, seeders_1.seedDatabase)();
                    console.log("Database seeded successfully");
                }
                catch (error) {
                    console.error("Error seeding database:", error);
                }
            }
            // Start the server
            app_1.default.listen(PORT, () => {
                console.log(`Server running on port ${PORT} in ${config_1.default.NODE_ENV} mode`);
                console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            });
        }
        catch (error) {
            console.error("Error starting the server:", error);
            process.exit(1);
        }
    });
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    // Don't exit in production, just log the error
    if (config_1.default.NODE_ENV !== "production") {
        process.exit(1);
    }
});
//  Start the server
startServer();
