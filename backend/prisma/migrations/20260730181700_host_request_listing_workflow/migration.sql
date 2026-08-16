/*
  Warnings:

  - You are about to drop the column `type` on the `Rooms` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HostRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GovernmentIdType" AS ENUM ('AADHAAR', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'PAN', 'OTHER');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('HOTEL', 'PG', 'HOSTEL', 'APARTMENT', 'VILLA', 'HOMESTAY');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BookingMode" AS ENUM ('ENTIRE_PROPERTY', 'PER_ROOM');

-- DropIndex
DROP INDEX "idx_rooms_address_type_price";

-- DropIndex
DROP INDEX "idx_rooms_filter_main";

-- DropIndex
DROP INDEX "idx_rooms_type";

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "listingId" INTEGER,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "type",
ADD COLUMN     "listingId" INTEGER;

-- CreateTable
CREATE TABLE "HostRequest" (
    "requestId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "governmentIdType" "GovernmentIdType" NOT NULL,
    "governmentIdUrl" TEXT NOT NULL,
    "businessName" TEXT,
    "status" "HostRequestStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedById" INTEGER,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "HostRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "Listing" (
    "listingId" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "type" "ListingType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "thumbnailUrl" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedById" INTEGER,
    "bookingMode" "BookingMode" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("listingId")
);

-- CreateTable
CREATE TABLE "ListingImage" (
    "imageId" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caption" TEXT,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateIndex
CREATE INDEX "HostRequest_userId_status_idx" ON "HostRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "HostRequest_status_idx" ON "HostRequest"("status");

-- CreateIndex
CREATE INDEX "Listing_city_type_status_idx" ON "Listing"("city", "type", "status");

-- CreateIndex
CREATE INDEX "Listing_ownerId_idx" ON "Listing"("ownerId");

-- CreateIndex
CREATE INDEX "Listing_type_idx" ON "Listing"("type");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_city_idx" ON "Listing"("city");

-- CreateIndex
CREATE INDEX "Listing_country_idx" ON "Listing"("country");

-- CreateIndex
CREATE INDEX "ListingImage_listingId_idx" ON "ListingImage"("listingId");

-- CreateIndex
CREATE INDEX "idx_reviews_listing" ON "Reviews"("listingId");

-- CreateIndex
CREATE INDEX "idx_rooms_listing" ON "Rooms"("listingId");

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("listingId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("listingId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostRequest" ADD CONSTRAINT "HostRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostRequest" ADD CONSTRAINT "HostRequest_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("listingId") ON DELETE CASCADE ON UPDATE CASCADE;
