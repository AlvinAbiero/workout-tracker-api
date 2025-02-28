import { UserModel, User, UserResponse } from "../models/User";
import { comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwt";
import { compare } from "bcryptjs";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export class AuthService {
  static async registerUser(userData: User): Promise<AuthResponse> {
    try {
      // Check if username already exists
      const existingUsername = await UserModel.findByUsername(
        userData.username
      );
      if (existingUsername) {
        throw new Error("Username already exists");
      }

      // check if email already exist
      const existingEmail = await UserModel.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      // Create new user
      const user = await UserModel.create(userData);

      // Generate new user
      const token = generateToken(user.id, user.username, user.email);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user by username
      const user = await UserModel.findByUsername(credentials.username);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await comparePassword(
        credentials.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = generateToken(user.id, user.username, user.email);

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as UserResponse,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserProfile(userId: number): Promise<UserResponse> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProfile(
    userId: number,
    userData: Partial<User>
  ): Promise<UserResponse> {
    try {
      const updatedUser = await UserModel.update(userId, userData);
      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      //  Get user with password
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isPasswordValid = await comparePassword(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      const updated = await UserModel.updatePassword(userId, newPassword);
      if (!updated) {
        throw new Error("Failed to update password");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
