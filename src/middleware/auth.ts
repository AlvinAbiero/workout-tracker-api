import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const getTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;

    if (!decoded.id || !decoded.username || !decoded.email) {
      res.status(400).json({ message: "Invalid token payload" });
      return;
    }

    req.user = {
      id: decoded.id as number,
      username: decoded.username as string,
      email: decoded.email as string,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
