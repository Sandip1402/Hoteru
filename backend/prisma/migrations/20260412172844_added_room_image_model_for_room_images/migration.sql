-- CreateTable
CREATE TABLE "RoomImage" (
    "imgId" SERIAL NOT NULL,
    "altText" TEXT,
    "imgUrl" TEXT,
    "coverImg" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "RoomImage_pkey" PRIMARY KEY ("imgId")
);

-- AddForeignKey
ALTER TABLE "RoomImage" ADD CONSTRAINT "RoomImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
