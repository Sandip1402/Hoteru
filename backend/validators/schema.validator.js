import { z } from "zod";

const trimmedEnum = (values) =>
  z.preprocess(
    (value) => typeof value === "string" ? value.trim() : value,
    z.enum(values)
  );

// Host Request
const governmentIdTypes = [
  "AADHAAR",
  "PASSPORT",
  "DRIVING_LICENSE",
  "VOTER_ID",
  "PAN",
  "OTHER",
];

const hostRequestStatuses = [
  "APPROVE",
  "REJECT",
];

export const createHostRequestSchema = z.object({
  phoneNumber: z.string()
    .trim()
    .regex(
      /^\+?[0-9][0-9\s()-]{7,20}$/,
      "Invalid phone number."
    ),
  governmentIdType: trimmedEnum(governmentIdTypes),

  governmentIdUrl: z
    .string()
    .trim()
    .url("Government ID URL must be a valid URL."),

  businessName: z
    .string()
    .trim()
    .max(100, "Business name cannot exceed 100 characters.")
    .optional(),
});

export const reviewHostRequestSchema = z.object({
  action: trimmedEnum(hostRequestStatuses),

  adminNotes: z
    .string()
    .trim()
    .max(500, "Admin notes cannot exceed 500 characters.")
    .optional(),
});


// Room

export const roomTypeEnum = [
  "SINGLE",
  "DOUBLE",
  "TWIN",
  "TRIPLE",
  "QUAD",
  "DORMITORY",
  "SUITE",
  "DELUXE",
  "FAMILY",
  "STUDIO",
  "ENTIRE_UNIT"
];

const RoomBaseSchema = z.object({
  name: z.string().trim().min(3).max(100),

  description: z.string().trim().max(2000).optional(),

  roomType: trimmedEnum(roomTypeEnum),

  maxGuests: z.coerce.number().int().min(1).max(50),

  bedrooms: z.coerce.number().int().min(0).optional(),

  beds: z.coerce.number().int().min(1),

  bathrooms: z.coerce.number().min(0.5).max(20),

  baseprice: z.coerce.number().positive(),

  quantity: z.coerce.number().int().min(1).default(1),

  area: z.coerce.number().positive().optional(),

  areaUnit: z.enum(["SQ_FT", "SQ_M"]).optional(),

  isActive: z.boolean().optional()

});

export const createRoomSchema = RoomBaseSchema.refine(
  ({ area, areaUnit }) =>
    (area == null && areaUnit == null) ||
    (area != null && areaUnit != null),
  {
    message: "Area and area unit must be provided together.",
    path: ["area"],
  }
);

export const updateRoomSchema =
  RoomBaseSchema.partial()
    .refine(
      ({ area, areaUnit }) =>
        (area == null && areaUnit == null) ||
        (area != null && areaUnit != null),
      {
        message: "Area and area unit must be provided together.",
        path: ["area"],
      }
    );


// Listing

const listingType = [
  "HOTEL",
  "PG",
  "HOSTEL",
  "APARTMENT",
  "VILLA",
  "HOMESTAY",
  "RESORT",
];

const ListingBaseSchema = z.object({
  type: trimmedEnum(listingType),

  name: z.string().trim()
    .min(3, "Listing name must be at least 3 characters.")
    .max(100, "Listing name cannot exceed 100 characters."),

  description: z.string().trim()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),

  checkInTime: z.coerce.date().optional(),

  checkOutTime: z.coerce.date().optional(),

  contactPhone: z.string()
    .trim()
    .regex(
      /^\+?[0-9][0-9\s()-]{7,20}$/,
      "Invalid phone number."
    ),

  contactEmail: z.string().trim()
    .email("Invalid email address.")
    .optional(),

  addressLine1: z.string().trim()
    .min(5, "Address is required.")
    .max(200),

  addressLine2: z.string().trim().max(200).optional(),

  landmark: z.string().trim().max(200).optional(),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  country: z.string().trim().min(2).max(100),

  postalCode: z.string().trim().min(3).max(20),

  latitude: z.coerce.number().min(-90).max(90).optional(),

  longitude: z.coerce.number().min(-180).max(180).optional(),

  bookingMode: trimmedEnum([
    "ENTIER_PROPERTY",
    "PER_ROOM",
  ]),

});

export const createListingSchema = ListingBaseSchema.refine(
  ({ latitude, longitude }) =>
    (latitude == null && longitude == null) ||
    (latitude != null && longitude != null),
  {
    message: "Latitude and longitude must be provided together.",
    path: ["latitude"],
  }
);

export const updateListingSchema =
  ListingBaseSchema.partial().strict()
    .refine(
      ({ latitude, longitude }) =>
        (latitude == null && longitude == null) ||
        (latitude != null && longitude != null),
      {
        message: "Latitude and longitude must be provided together.",
        path: ["latitude"],
      }
    );

export const reviewListingSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),

  adminNotes: z.string().trim().max(500).optional(),
})
  .superRefine((data, ctx) => {
    if (
      data.action === "REJECTED" &&
      (!data.adminNotes || data.adminNotes.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adminNotes"],
        message: "Admin notes are required when rejecting a listing.",
      });
    }
  });


// Amenity

export const createAmenitySchema = z.object({
  name: z.string().trim()
    .min(2, "Amenity name must be at least 2 characters.")
    .max(50, "Amenity name cannot exceed 50 characters."),
});

export const updateAmenitySchema = createAmenitySchema.partial();

export const updateRoomAmenitiesSchema = z.object({
  amenityIds: z.array(z.number().int().positive())
    .refine(
      (ids) => ids.length === new Set(ids).size,
      {
        message: "Duplicate amenity IDs are not allowed.",
      }
    ),
});

export const updateListingAmenitiesSchema = z.object({
  amenityIds: z.array(z.number().int().positive())
    .refine(
      (ids) => ids.length === new Set(ids).size,
      {
        message: "Duplicate amenity IDs are not allowed.",
      }
    ),
});


// Booking

const paymentOption = [
  "PAY_NOW",
  "PAY_PARTIALLY",
  "PAY_AT_CHECKIN",
];

const paymentMethod = [
  "CASH",
  "CARD",
  "UPI",
  "NET_BANKING",
];

export const createBookingSchema = z.object({
  roomId: z.coerce.number().int().positive(),

  checkIn: z.coerce.date(),

  checkOut: z.coerce.date(),

  guests: z.coerce.number().int().min(1).max(50),

  paymentOption: z.enum(paymentOption),

  // remainingPaymentMethod: z.enum(paymentMethod), // fix bocomes relevant when we implement pay_at_checkin
})
  .refine(
    (data) => data.checkOut > data.checkIn,
    {
      message: "Check-out must be after check-in.",
      path: ["checkOut"],
    }
  )
  .superRefine((data, ctx) => {
    if (
      data.paymentOption === "PAY_PARTIALLY" &&
      !data.remainingPaymentMethod
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["remainingPaymentMethod"],
        message:
          "Remaining payment mode is required for partial payment.",
      });
    }

    if (
      data.paymentOption === "PAY_NOW" &&
      data.remainingPaymentMethod
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["remainingPaymentMethod"],
        message:
          "Remaining payment mode must not be provided for full online payment.",
      });
    }
  });

export const cancelBookingSchema = z.object({
  cancellationReason: z.string().trim().min(5).max(500),
});


// Payment

export const createPaymentOrderSchema = z.object({
  purpose: z.enum(["BOOKING", "REMAINING"]),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.coerce.number().int().positive(),

  razorpayOrderId: z.string().min(1),

  razorpayPaymentId: z.string().min(1),

  razorpaySignature: z.string().min(1),
});


// Review

export const createReviewSchema = z.object({
  bookingId: z
    .number({
      required_error: "Booking ID is required.",
    })
    .int()
    .positive(),

  rating: z
    .number({
      required_error: "Rating is required.",
    })
    .int()
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),

  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters.")
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),

  comment: z.string().trim().max(2000).optional(),
});


// Search

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const searchListingsSchema = z.object({
  destination: z.string().trim().optional(),

  checkIn: z.coerce.date().optional(),

  checkOut: z.coerce.date().optional(),

  guests: z.coerce.number().int().positive().default(1),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  rating: z.coerce.number().min(1).max(5).optional(),

  amenities: z.string().optional(),

  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),

  limit: z.coerce.number().int().min(1).max(MAX_LIMIT)
    .default(DEFAULT_LIMIT),

  sort: z.enum([
    "newest",
    "oldest",
    "rating_desc",
    "rating_asc",
  ]).default("newest"),
}).refine(({ checkIn, checkOut }) => {
  if (!checkIn || !checkOut) return true;

  return checkIn < checkOut;
}, {
  path: ["query", "checkOut"],
  message: "Check-out must be after check-in.",
});

export const searchSuggestionsSchema = z.object({
  destination: z.string().trim().min(1).max(100),
});