/*
  Warnings:

  - The primary key for the `ListingAmenity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amenityeId` on the `ListingAmenity` table. All the data in the column will be lost.
  - Added the required column `amenityId` to the `ListingAmenity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListingAmenity" DROP CONSTRAINT "ListingAmenity_amenityeId_fkey";

-- AlterTable
ALTER TABLE "ListingAmenity" DROP CONSTRAINT "ListingAmenity_pkey",
DROP COLUMN "amenityeId",
ADD COLUMN     "amenityId" INTEGER NOT NULL,
ADD CONSTRAINT "ListingAmenity_pkey" PRIMARY KEY ("listingId", "amenityId");

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("amenityId") ON DELETE CASCADE ON UPDATE CASCADE;
