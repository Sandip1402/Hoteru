import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";

export const ensureBookingCanBeReviewed = (
  booking,
  existingReview
) => {
  if (booking.status !== "COMPLETED") {
    throw new AppError(
      400,
      "Only completed bookings can be reviewed."
    );
  }

  if (existingReview) {
    throw new AppError(
      409,
      "You have already reviewed this booking."
    );
  }
};


export const recalculateListingRating = async (listingId, tx = prisma) => {
  const aggregate = await tx.review.aggregate({
    where: {
      listingId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  await tx.listing.update({
    where: {
      listingId,
    },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count._all,
    },
  });
};