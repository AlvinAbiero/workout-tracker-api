import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { catchAsync } from "../utils/asyncHandler";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password, first_name, last_name } = req.body;

  const result = await AuthService.registerUser({
    username,
    email,
    password,
    first_name,
    last_name,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await AuthService.loginUser({ username, password });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await AuthService.getUserProfile(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { first_name, last_name, email } = req.body;

  const updatedUser = await AuthService.updateUserProfile(userId, {
    first_name,
    last_name,
    email,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { current_password, new_password } = req.body;

    await AuthService.changePassword(userId, current_password, new_password);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
