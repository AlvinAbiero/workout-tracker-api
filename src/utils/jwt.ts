import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

export const generateToken = (
  userId: number,
  username: string,
  email: string
): string => {
  return jwt.sign({ id: userId, username, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
