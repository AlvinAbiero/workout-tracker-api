import { Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: AppError, res: Response) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
