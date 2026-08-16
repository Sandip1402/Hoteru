import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";
import {
  ensureBookingCanBeReviewed,
  recalculateListingRating,
} from "../utils/review.helper.js";


export const createReview = async (guestId, data) => {
  const booking = await prisma.booking.findFirst({
    where: {
      bookingId: data.bookingId,
      guestId,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found.");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId: booking.bookingId,
    },
  });

  ensureBookingCanBeReviewed(
    booking,
    existingReview
  );

  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId: booking.bookingId,
        listingId: booking.listingId,
        guestId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    await recalculateListingRating(booking.listingId, tx);

    return review;
  });
};

export const updateReview = async (
  reviewId,
  guestId,
  data
) => {
  const review = await prisma.review.findFirst({
    where: {
      reviewId,
      guestId,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found.");
  }

  return prisma.$transaction(async (tx) => {
    const updatedReview =
      await tx.review.update({
        where: {
          reviewId,
        },
        data,
      });

    await recalculateListingRating(
      review.listingId,
      tx
    );

    return updatedReview;
  });
};

export const deleteReview = async (
  reviewId,
  guestId
) => {
  const review = await prisma.review.findFirst({
    where: {
      reviewId,
      guestId,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: {
        reviewId,
      },
    });

    await recalculateListingRating(
      review.listingId,
      tx
    );
  });
};

export const getListingReviews = async (
  listingId
) => {
  return prisma.review.findMany({
    where: {
      listingId,
    },

    include: {
      guest: {
        select: {
          userId: true,
          firstname: true,
          lastname: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMyReviews = async (guestId) => {
  return prisma.review.findMany({
    where: {
      guestId,
    },
    include: {
      listing: {
        select: {
          listingId: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};