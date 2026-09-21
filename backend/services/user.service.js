import { prisma } from "../lib/prisma.js";
import { mapAuth0User } from "../utils/mapper.js";
import AppError from "../utils/app-error.js";
import * as storageService from "./storage.service.js"
import { env } from "../config.js";

export const syncCurrentUser = async (accessToken) => {
  const response = await fetch(`https://${env.AUTH0_DOMAIN}/userinfo`, {
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
    update: {
      email: userData.email,
    },
    create: userData,
  });
};

function checkIsAdult(dobValue) {
  const birthDate = new Date(dobValue);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the birth month hasn't occurred yet this year, 
  // or it is the birth month but the birth day hasn't occurred yet, subtract 1 year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
}

export const updateUser = async (guestId, data) => {
  const user = await prisma.user.findUnique({
    where: {
      userId: guestId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const allowedFields = {
    firstname: data.firstname,
    lastname: data.lastname,
    country: data.country,
    DOB: data.DOB
      ? new Date(data.DOB)
      : null,
    isAdult: data.DOB
      ? checkIsAdult(data.DOB)
      : null,
  };

  // Remove undefined values
  Object.keys(allowedFields).forEach((key) => {
    if (allowedFields[key] === undefined) {
      delete allowedFields[key];
    }
  });

  return prisma.user.update({
    where: {
      userId: guestId,
    },
    data: allowedFields,
  });
};

export const updateProfileImage = async (guestId, file = null) => {
  const user = await prisma.user.findUnique({
    where: {
      userId: guestId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const profileImage = await storageService.uploadImage(file, "user");

  if (!profileImage) {
    throw new AppError(401, "Failed to upload profile image. Please try again.");
  }

  await prisma.user.update({
    where: { userId: guestId },
    data: {
      image: profileImage.imageUrl,
    }
  });

  return profileImage;
}

export const getUserByAuth0Id = async (auth0Id) => {
  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};