import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../config.js";;
import AppError from "../utils/app-error.js";

import * as userService from "../services/user.service.js";

// JWT validation middleware
export const checkJwt = auth({
  issuerBaseURL: `https://${env.AUTH0_DOMAIN}`,
  audience: env.AUTH0_AUDIENCE,
});

// Attach current database user to request
export const attachCurrentUser = async (req, res, next) => {
  try {
    const auth0Id = req.auth?.payload?.sub;

    if (!auth0Id) {
      return next(new AppError(401, "Missing auth subject"));
    }

    // fetch user from DB
    const user = await userService.getUserByAuth0Id(auth0Id);

    // Attach roles
    req.user = {
      id: user.userId,
      auth0Id: user.auth0Id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: req.auth.payload?.[env.AUTH0_NAMESPACE + "/roles"] ?? [],
    };
  
    next();
  } catch (error) {
    return next(error);
  }
};

// Role authorization middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles ?? [];

    const hasRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return next(new AppError(403, "Fobidden : Insufficent permission"));
    }

    next();
  };
};