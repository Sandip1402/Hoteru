// import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.js";

// console.log(process.env.DATABASE_URL);
console.log("🚀 seed.js loaded");

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDataPath = path.join(__dirname, "..", "hoteru-seed-files");

console.log("Seed folder path : ", seedDataPath);

const listings = JSON.parse(
    fs.readFileSync(
        path.join(seedDataPath, "hoteru-listings-seed.json"),
        "utf-8"
    )
);

const rooms = JSON.parse(
    fs.readFileSync(
        path.join(seedDataPath, "hoteru-rooms-seed.json"),
        "utf-8"
    )
);

const amenities = JSON.parse(
    fs.readFileSync(
        path.join(seedDataPath, "hoteru-amenities-seed.json"),
        "utf-8"
    )
);

const amenityRelations = JSON.parse(
    fs.readFileSync(
        path.join(seedDataPath, "hoteru-amenity-relations-seed.json"),
        "utf-8"
    )
);

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const OWNER_ID = 97;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getRoomType(type) {
    return type;
}

function getBedCount(room) {
    return room.beds ?? 1;
}

// --------------------------------------------------
// Main seed
// --------------------------------------------------

async function main() {
    console.log("🌱 Starting Hoteru seed...\n");

    // --------------------------------------------------
    // 1. Verify owner
    // --------------------------------------------------

    const owner = await prisma.user.findUnique({
        where: {
            userId: OWNER_ID,
        },
    });

    if (!owner) {
        throw new Error(
            `Owner user with userId=${OWNER_ID} does not exist. ` +
            `Create the user first before running the seed.`
        );
    }

    console.log(`✓ Owner found: ${owner.email}\n`);

    // --------------------------------------------------
    // 2. Listings
    // --------------------------------------------------

    console.log("🏨 Seeding listings...");

    /*
     * Maps source HotelId -> actual Prisma listingId.
     *
     * Example:
     * "27" -> 153
     *
     * This allows rooms and amenities to reference
     * the generated Prisma ID without manually setting it.
     */
    const listingMap = new Map();

    let listingsCreated = 0;
    let listingsSkipped = 0;

    for (const seedListing of listings) {
        const {
            hotelId,
            ...listingData
        } = seedListing;

        /*
         * We use a combination of stable fields to detect
         * whether this seed listing already exists.
         *
         * Since hotelId is NOT a database field, we cannot
         * query Prisma directly by hotelId.
         */
        const existingListing = await prisma.listing.findFirst({
            where: {
                name: listingData.name,
                ownerId: OWNER_ID,
            },
        });

        if (existingListing) {
            listingMap.set(String(hotelId), existingListing.listingId);
            listingsSkipped++;

            console.log(
                `  ↷ Skipped listing: ${listingData.name} ` +
                `(listingId=${existingListing.listingId})`
            );

            continue;
        }

        const createdListing = await prisma.listing.create({
            data: {
                ...listingData,
                checkInTime: new Date(`1970-01-01T${listingData.checkInTime}.000Z`),
                checkOutTime: new Date(`1970-01-01T${listingData.checkOutTime}.000Z`),
                ownerId: OWNER_ID,
            },
        });

        listingMap.set(String(hotelId), createdListing.listingId);
        listingsCreated++;

        console.log(
            `  ✓ Created listing: ${createdListing.name} ` +
            `(listingId=${createdListing.listingId})`
        );
    }

    console.log(
        `\nListings: ${listingsCreated} created, ` +
        `${listingsSkipped} already existed.\n`
    );

    // --------------------------------------------------
    // 3. Rooms
    // --------------------------------------------------

    console.log("🛏️ Seeding rooms...");

    let roomsCreated = 0;
    let roomsSkipped = 0;

    /*
     * The room JSON contains hotelId rather than listingId.
     *
     * We resolve:
     *
     * hotelId -> listingMap -> listingId
     */

    for (const seedRoom of rooms) {
        const {
            hotelId,
            ...roomData
        } = seedRoom;

        const listingId = listingMap.get(String(hotelId));

        if (!listingId) {
            throw new Error(
                `No listing found for hotelId=${hotelId}`
            );
        }

        /*
         * Because room names are not necessarily unique globally,
         * we check within the listing.
         *
         * This makes the seed safe to run again.
         */
        const existingRoom = await prisma.room.findFirst({
            where: {
                listingId,
                name: roomData.name,
                basePrice: roomData.basePrice,
            },
        });

        if (existingRoom) {
            roomsSkipped++;

            continue;
        }

        const createdRoom = await prisma.room.create({
            data: {
                listingId,
                name: roomData.name,
                description: roomData.description,
                roomType: getRoomType(roomData.roomType),
                maxGuests: roomData.maxGuests,
                bedrooms: roomData.bedrooms,
                beds: getBedCount(roomData),
                bathrooms: roomData.bathrooms,
                basePrice: roomData.basePrice,
                quantity: roomData.quantity,
                area: roomData.area ?? null,
                areaUnit: roomData.areaUnit ?? null,
                isActive: roomData.isActive ?? true,
            },
        });

        console.log(
            `  ✓ Created room: ${createdRoom.name} ` +
            `(listingId=${createdRoom.roomId})`
        );

        roomsCreated++;
    }

    console.log(
        `Rooms: ${roomsCreated} created, ` +
        `${roomsSkipped} already existed.\n`
    );

    // --------------------------------------------------
    // 4. Amenities
    // --------------------------------------------------

    console.log("✨ Seeding amenities...");

    const amenityMap = new Map();

    let amenitiesCreated = 0;
    let amenitiesSkipped = 0;

    for (const seedAmenity of amenities) {
        const existingAmenity = await prisma.amenity.findFirst({
        where: {
            name: {
                equals: seedAmenity.name,
                mode: "insensitive",
            },
        },
        });

        if (existingAmenity) {
            amenityMap.set(seedAmenity.name, existingAmenity.amenityId);
            amenitiesSkipped++;

            continue;
        }

        const createdAmenity = await prisma.amenity.create({
            data: {
                name: seedAmenity.name,
            },
        });

        amenityMap.set(seedAmenity.name, createdAmenity.amenityId);

        console.log(` ✓ Created amenity: ${createdAmenity.name} `)

        amenitiesCreated++;
    }

    console.log(
        `Amenities: ${amenitiesCreated} created, ` +
        `${amenitiesSkipped} already existed.\n`
    );

    // --------------------------------------------------
    // 5. Listing amenities
    // --------------------------------------------------

    console.log("🔗 Connecting listing amenities...");

    let listingAmenitiesCreated = 0;
    let listingAmenitiesSkipped = 0;

    for (const relation of amenityRelations.listingAmenities) {
        const listingId = listingMap.get(
            String(relation.hotelId)
        );

        if (!listingId) {
            throw new Error(
                `No listing found for hotelId=${relation.hotelId}`
            );
        }

        const amenityId = amenityMap.get(
            relation.amenityName
        );

        if (!amenityId) {
            throw new Error(
                `No amenity found for "${relation.amenityName}"`
            );
        }

        const existingRelation =
            await prisma.listingAmenity.findUnique({
                where: {
                    listingId_amenityId: {
                        listingId,
                        amenityId,
                    },
                },
            });

        if (existingRelation) {
            listingAmenitiesSkipped++;
            continue;
        }

        await prisma.listingAmenity.create({
            data: {
                listingId,
                amenityId,
            },
        });

        listingAmenitiesCreated++;
    }

    console.log(
        `Listing amenities: ${listingAmenitiesCreated} created, ` +
        `${listingAmenitiesSkipped} already existed.\n`
    );

    // --------------------------------------------------
    // 6. Room amenities
    // --------------------------------------------------

    console.log("🔗 Connecting room amenities...");

    /*
     * We need to resolve the actual roomId.
     *
     * Since the seed room data does not contain a Prisma
     * roomId, we find the room using its stable data:
     *
     * hotelId + name + basePrice
     */

    let roomAmenitiesCreated = 0;
    let roomAmenitiesSkipped = 0;

    for (const relation of amenityRelations.roomAmenities) {
        const listingId = listingMap.get(
            String(relation.hotelId)
        );

        if (!listingId) {
            throw new Error(
                `No listing found for hotelId=${relation.hotelId}`
            );
        }

        const room = await prisma.room.findFirst({
            where: {
                listingId,
                name: relation.roomName,
                basePrice: relation.basePrice,
            },
        });

        if (!room) {
            console.warn(
                `  ⚠ Room not found: ${relation.roomName} ` +
                `(hotelId=${relation.hotelId})`
            );

            continue;
        }

        const amenityId = amenityMap.get(
            relation.amenityName
        );

        if (!amenityId) {
            throw new Error(
                `No amenity found for "${relation.amenityName}"`
            );
        }

        const existingRelation =
            await prisma.roomAmenity.findUnique({
                where: {
                    roomId_amenityId: {
                        roomId: room.roomId,
                        amenityId,
                    },
                },
            });

        if (existingRelation) {
            roomAmenitiesSkipped++;
            continue;
        }

        await prisma.roomAmenity.create({
            data: {
                roomId: room.roomId,
                amenityId,
            },
        });

        roomAmenitiesCreated++;
    }

    console.log(
        `Room amenities: ${roomAmenitiesCreated} created, ` +
        `${roomAmenitiesSkipped} already existed.\n`
    );

    // --------------------------------------------------
    // Summary
    // --------------------------------------------------

    console.log("========================================");
    console.log("🌱 Hoteru seed completed successfully!");
    console.log("========================================");
    console.log(`Listings created:          ${listingsCreated}`);
    console.log(`Listings skipped:          ${listingsSkipped}`);
    console.log(`Rooms created:             ${roomsCreated}`);
    console.log(`Rooms skipped:             ${roomsSkipped}`);
    console.log(`Amenities created:         ${amenitiesCreated}`);
    console.log(`Amenities skipped:         ${amenitiesSkipped}`);
    console.log(
        `Listing amenities created: ${listingAmenitiesCreated}`
    );
    console.log(
        `Listing amenities skipped: ${listingAmenitiesSkipped}`
    );
    console.log(
        `Room amenities created:    ${roomAmenitiesCreated}`
    );
    console.log(
        `Room amenities skipped:    ${roomAmenitiesSkipped}`
    );
    console.log("========================================");
}

// --------------------------------------------------
// Run
// --------------------------------------------------

main()
    .catch((error) => {
        console.error("\n❌ Seed failed:");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });