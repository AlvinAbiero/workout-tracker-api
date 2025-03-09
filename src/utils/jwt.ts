import jwt, { Secret, SignOptions } from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET: Secret = config.JWT_SECRET as string;
const JWT_EXPIRATION: SignOptions["expiresIn"] = (config.JWT_EXPIRATION ||
  "24h") as SignOptions["expiresIn"];

export const generateToken = (
  userId: number,
  username: string,
  email: string
): string => {
  const payload = { id: userId, username, email };

  const options: SignOptions = { expiresIn: JWT_EXPIRATION };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
