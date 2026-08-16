/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `coverImg` on the `RoomImage` table. All the data in the column will be lost.
  - You are about to drop the column `imgUrl` on the `RoomImage` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `RoomImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `RoomImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "approvedAt",
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ListingImage" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RoomImage" DROP COLUMN "coverImg",
DROP COLUMN "imgUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "isCover" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "ListingAmenity" (
    "listingId" INTEGER NOT NULL,
    "amenityeId" INTEGER NOT NULL,

    CONSTRAINT "ListingAmenity_pkey" PRIMARY KEY ("listingId","amenityeId")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "userId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("userId","listingId")
);

-- CreateIndex
CREATE INDEX "Wishlist_userId_createdAt_idx" ON "Wishlist"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Wishlist_listingId_idx" ON "Wishlist"("listingId");

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_amenityeId_fkey" FOREIGN KEY ("amenityeId") REFERENCES "Amenity"("amenityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("listingId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("listingId") ON DELETE CASCADE ON UPDATE CASCADE;
