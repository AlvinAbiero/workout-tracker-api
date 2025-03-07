import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Server is running" });
});

app.use('/api',routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: req.path,
  });
});

// Add this error handler middleware before app.use(errorHandler)
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

app.use(errorHandler);

export default app;
