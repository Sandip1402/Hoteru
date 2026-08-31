import { prisma } from "../lib/prisma.js";
import { mapAuth0User } from "../utils/mapper.js";
import AppError from "../utils/app-error.js";
import { env } from "../config.js";

export const syncCurrentUser = async (accessToken) => {
  const response = await fetch(`https://${env.AUTH0_DOMAIN}/userinfo`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }
  );

  if (!response.ok) {
    throw new AppError(401, "Failed to fetch Auth0 user profile");
  }

  const authUser = await response.json();
  // console.log("Auth0 user in sync function : ", authUser);

  const userData = mapAuth0User(authUser);
  
  return prisma.user.upsert({
    where: {
      auth0Id: userData.auth0Id,
    },
    update: userData,
    create: userData,
  });
};

export const getUserByAuth0Id = async (auth0Id) => {
  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (!user) {
    throw new AppError(401, "User not found");
  }

  return user;
};