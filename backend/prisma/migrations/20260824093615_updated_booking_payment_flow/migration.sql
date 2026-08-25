/*
  Warnings:

  - The values [PAY_PARTIALLY,PAY_AT_CHECKIN] on the enum `PaymentOption` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAID] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `remainingPaymentMethod` on the `Booking` table. All the data in the column will be lost.
  - The `paymentStatus` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `baseprice` on the `Room` table. All the data in the column will be lost.
  - The primary key for the `RoomImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imgId` on the `RoomImage` table. All the data in the column will be lost.
  - Added the required column `mode` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingPayment" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'ONLINE');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentOption_new" AS ENUM ('PAY_NOW', 'BOOK_ONLY');
ALTER TABLE "Booking" ALTER COLUMN "paymentOption" TYPE "PaymentOption_new" USING ("paymentOption"::text::"PaymentOption_new");
ALTER TYPE "PaymentOption" RENAME TO "PaymentOption_old";
ALTER TYPE "PaymentOption_new" RENAME TO "PaymentOption";
DROP TYPE "public"."PaymentOption_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "remainingPaymentMethod",
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "BookingPayment" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "method",
ADD COLUMN     "gatewayMethod" TEXT,
ADD COLUMN     "mode" "PaymentMode" NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "baseprice",
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "RoomImage" DROP CONSTRAINT "RoomImage_pkey",
DROP COLUMN "imgId",
ADD COLUMN     "imageId" SERIAL NOT NULL,
ADD CONSTRAINT "RoomImage_pkey" PRIMARY KEY ("imageId");

-- DropEnum
DROP TYPE "BookingPaymentStatus";

-- DropEnum
DROP TYPE "PaymentMethod";
