import "@dotenvx/dotenvx/config";

export const env = {
    // Backend
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    // Auth0
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_NAMESPACE: process.env.AUTH0_NAMESPACE,
    AUTH0_APP_CLIENT_ID: process.env.AUTH0_APP_CLIENT_ID,
    AUTH0_APP_CLIENT_SECRET: process.env.AUTH0_APP_CLIENT_SECRET,
    HOST_ROLE_ID: process.env.HOST_ROLE_ID,

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL,

    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // Payment
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

    // Upload
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    MAX_IMAGE_SIZE: process.env.MAX_IMAGE_SIZE,

    // Booking
    BOOKING_PERCENTAGE: process.env.BOOKING_PERCENTAGE,
};