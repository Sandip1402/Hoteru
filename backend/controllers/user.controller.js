import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import AppError from "../utils/app-error.js";

export const syncCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.syncCurrentUser(req.auth.token);
  user.roles = req.user.roles;

  res.status(200).json({
    success: true,
    message: "User synchronized successfully",
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  await userService.updateUser(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "User profile updated.",
  })
})

export const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload a new file.");
  }

  const profileImage = await userService.updateProfileImage(req.user.id, req.file);

  res.status(200).json({
    success: true,
    message: "User profile image updated.",
    data: profileImage,
  })
})