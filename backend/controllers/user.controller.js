import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const syncCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await userService.syncCurrentUser(req.auth.token);

  res.status(200).json({
    success: true,
    message: "User synchronized successfully",
    data: user,
  });
});