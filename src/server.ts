import app from "./app";
import pool from "./config/database";
import { seedDatabase } from "./seeders";
import config from "./config/config";

const PORT = config.PORT;

async function checkDbConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Databse connection failed:", error);
    return false;
  }
}

async function startServer() {
  try {
    // Check database connection
    const dbConnected = await checkDbConnection();

    if (!dbConnected) {
      console.error("Unable to connect to the database. Exiting application.");
      process.exit(1);
    }

    // Seed the database if in development mode
    if (config.NODE_ENV === "development") {
      try {
        await seedDatabase();
        console.log("Database seeded successfully");
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  // Don't exit in production, just log the error
  if (config.NODE_ENV !== "production") {
    process.exit(1);
  }
});

//  Start the server
startServer();
