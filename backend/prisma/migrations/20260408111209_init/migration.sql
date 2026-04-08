-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "image" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "DOB" TIMESTAMP(3),
    "isAdult" BOOLEAN,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "bookingId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("bookingId")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "roomId" SERIAL NOT NULL,
    "addressId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "desc" TEXT,
    "guests" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "avgRating" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" SERIAL NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "location" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "Services" (
    "roomId" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Services_pkey" PRIMARY KEY ("roomId","service")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "reviewId" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "Likes" (
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("userId","roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_auth0Id_key" ON "Users"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_users_email_unique" ON "Users"("email");

-- CreateIndex
CREATE INDEX "idx_users_country" ON "Users"("country");

-- CreateIndex
CREATE INDEX "idx_users_created_at" ON "Users"("createdAt");

-- CreateIndex
CREATE INDEX "idx_bookings_user" ON "Bookings"("userId");

-- CreateIndex
CREATE INDEX "idx_bookings_room" ON "Bookings"("roomId");

-- CreateIndex
CREATE INDEX "idx_bookings_user_created" ON "Bookings"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_bookings_room_dates" ON "Bookings"("roomId", "checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "idx_bookings_dates" ON "Bookings"("checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "idx_bookings_created_at" ON "Bookings"("createdAt");

-- CreateIndex
CREATE INDEX "idx_rooms_address" ON "Rooms"("addressId");

-- CreateIndex
CREATE INDEX "idx_rooms_type" ON "Rooms"("type");

-- CreateIndex
CREATE INDEX "idx_rooms_price" ON "Rooms"("price");

-- CreateIndex
CREATE INDEX "idx_rooms_guest" ON "Rooms"("guests");

-- CreateIndex
CREATE INDEX "idx_rooms_rating" ON "Rooms"("avgRating");

-- CreateIndex
CREATE INDEX "idx_rooms_filter_main" ON "Rooms"("type", "price", "guests");

-- CreateIndex
CREATE INDEX "idx_rooms_address_type_price" ON "Rooms"("addressId", "type", "price");

-- CreateIndex
CREATE INDEX "idx_rooms_created_at" ON "Rooms"("createdAt");

-- CreateIndex
CREATE INDEX "idx_address_city" ON "Address"("city");

-- CreateIndex
CREATE INDEX "idx_address_state" ON "Address"("state");

-- CreateIndex
CREATE INDEX "idx_address_country" ON "Address"("country");

-- CreateIndex
CREATE INDEX "idx_address_city_state_country" ON "Address"("city", "state", "country");

-- CreateIndex
CREATE INDEX "idx_services_service" ON "Services"("service");

-- CreateIndex
CREATE INDEX "idx_reviews_user" ON "Reviews"("userId");

-- CreateIndex
CREATE INDEX "idx_reviews_room" ON "Reviews"("roomId");

-- CreateIndex
CREATE INDEX "idx_reviews_room_created" ON "Reviews"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_reviews_rating" ON "Reviews"("rating");

-- CreateIndex
CREATE INDEX "idx_likes_room" ON "Likes"("roomId");

-- CreateIndex
CREATE INDEX "idx_likes_user_created" ON "Likes"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
