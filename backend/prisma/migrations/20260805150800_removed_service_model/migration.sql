/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `listingId` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "ListingType" ADD VALUE 'RESORT';

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_roomId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "listingId" SET NOT NULL;

-- DropTable
DROP TABLE "Service";
