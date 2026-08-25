import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.js";

// console.log(process.env.DATABASE_URL);
console.log("🚀 seed.js loaded");

async function main() {

    console.log('🧹 Cleaning up old data...');

    // Delete child records first in dependency order
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.roomImage.deleteMany();
    await prisma.room.deleteMany();
    await prisma.listingImage.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.hostRequest.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.user.deleteMany();

    console.log('✨ Database cleared. Starting seed...');

    console.log('🌱 Starting master database seed...');


    console.log('👥 Seeding users...');
    const host = await prisma.user.create({
        data: {
            auth0Id: "auth0|6a05a16a377aed62cd01bcac",
            firstname: "Tony",
            lastname: "Stark",
            email: "das234581@gmail.com"
        }
    })
    const user = await prisma.user.create({
        data: {
            auth0Id: "auth0|6a71e81049e2d71ca53e4998",
            firstname: "Tom",
            lastname: "Holland",
            email: "dass53795@gmail.com"
        },
    });
    const admin = await prisma.user.create({
        data:
        {
            auth0Id: "google-oauth2|106442762665204294656",
            firstname: "Sandip",
            lastname: "Das",
            email: "sd5147083@gmail.com"
        },
    })
    console.log('Seeded - ', host, user, admin);


    console.log('🤵 Seeding host requests...');
    const hostRequests = await prisma.hostRequest.create({
        data: {
            userId: user.userId,
            phoneNumber: "+91-8348989549",
            governmentIdType: "AADHAAR",
            governmentIdUrl: "https://strapi-cdn.indmoney.com/cdn-cgi/image/quality=80,format=auto,metadata=copyright,width=700/https://strapi-cdn.indmoney.com/xlarge_Slide_16_9_731_1794c433db.jpg",
        }
    });
    console.log('Seeded - ', hostRequests);


    console.log('Seeding amenities..');
    const amenityCount = await prisma.amenity.createMany({
        data: [
            { name: "WiFi" },
            { name: "Parking" },
            { name: "Pool" },
            { name: "Restaurant" },
            { name: "Gym" },
            { name: "Spa" },
            { name: "Breakfast" },
            { name: "Pets" },
            { name: "Air Conditioning" },
            { name: "TV" },
            { name: "Bicycle Rental" },
            { name: "Pharmacy" },
        ]
    })
    console.log('Seeded - ', amenityCount, ' amenities');

    console.log('🏠 Seeding listings...');
    const listing1 = await prisma.listing.create({
        data: {
            ownerId: host.userId,
            type: "HOMESTAY",
            name: "Malibu Cliffside Retreat",
            description: "Breathtaking ocean views with premium luxury amenities.",
            checkInTime: new Date("1998-12-24T16:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+1-310-555-0143",
            addressLine1: "24800 Pacific Coast Highway",
            city: "Malibu",
            state: "California",
            country: "USA",
            postalCode: "90265",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        }
    })
    const listing2 = await prisma.listing.create({
        data: {
            ownerId: admin.userId,
            type: "APARTMENT",
            name: "Shinjuku Neon Skybox",
            description: "Compact modern living in the heart of Tokyo.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T10:00:00.000Z"), // Standard Tokyo morning checkout
            contactPhone: "+81-3-5555-0192",
            addressLine1: "2-Chome-1-1 Nishi-Shinjuku",
            city: "Tokyo",
            state: "Tokyo Prefecture",
            country: "Japan",
            postalCode: "160-0023",
            status: "APPROVED",
            bookingMode: "PER_ROOM",
        }
    })
    const listing3 = await prisma.listing.create({
        data: {
            ownerId: admin.userId,
            type: "VILLA",
            name: "Santorini Sunset Horizon",
            description: "Traditional whitewashed villa with a private infinity pool.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+30-22860-55501",
            addressLine1: "Oia Cliffside Walkway 42",
            city: "Santorini",
            state: "Cyclades",
            country: "Greece",
            postalCode: "84702",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        }
    })
    const listings = [
        {
            ownerId: host.userId,
            type: "APARTMENT",
            name: "The London Brickhouse",
            description: "Charming Victorian loft conversion close to underground transit.",
            checkInTime: new Date("1998-12-24T14:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+44-20-7946-0155",
            addressLine1: "74 Commercial Street, Spitalfields",
            city: "London",
            state: "England",
            country: "UK",
            postalCode: "E1 6LY",
            status: "PENDING",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: host.userId,
            type: "HOMESTAY",
            name: "Banff Alpine Hideaway",
            description: "Rustic wooden cabin nestled deep in the Rocky Mountains.",
            checkInTime: new Date("1998-12-24T16:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+1-403-555-0187",
            addressLine1: "Tunnel Mountain Road 104",
            city: "Banff",
            state: "Alberta",
            country: "Canada",
            postalCode: "T1L 1B1",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        },
        {
            ownerId: admin.userId,
            type: "APARTMENT",
            name: "Manhattan Loft Heights",
            description: "Industrial chic studio apartment featuring floor-to-ceiling windows.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+1-212-555-0128",
            addressLine1: "530 West 27th Street",
            city: "New York",
            state: "New York",
            country: "USA",
            postalCode: "10001",
            status: "PENDING",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: host.userId,
            type: "RESORT",
            name: "Ubud Rainforest Sanctuary",
            description: "Eco-friendly luxury villas surrounded by tropical rice terraces.",
            checkInTime: new Date("1998-12-24T14:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T12:00:00.000Z"), // Resort-style late checkout
            contactPhone: "+62-361-555019",
            addressLine1: "Jalan Raya Tegallalang",
            city: "Ubud",
            state: "Bali",
            country: "Indonesia",
            postalCode: "80561",
            status: "PENDING",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: admin.userId,
            type: "APARTMENT",
            name: "Sydney Harbour Panorama",
            description: "Premium high-rise apartment overlooking the Opera House.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T10:00:00.000Z"),
            contactPhone: "+61-2-9555-0174",
            addressLine1: "1 Alfred Street, Circular Quay",
            city: "Sydney",
            state: "New South Wales",
            country: "Australia",
            postalCode: "2000",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        },
        {
            ownerId: host.userId,
            type: "HOMESTAY",
            name: "Cape Town Coastline Manor",
            description: "Modern architectural gem positioned right on Camps Bay Beach.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+27-21-555-0136",
            addressLine1: "64 Victoria Road",
            city: "Cape Town",
            state: "Western Cape",
            country: "South Africa",
            postalCode: "8005",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        },
        {
            ownerId: host.userId,
            type: "APARTMENT",
            name: "Parisian Art Deco Studio",
            description: "Elegant heritage studio situated in the historic Marais district.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            contactPhone: "+33-1-4227-0188",
            addressLine1: "12 Rue des Rosiers",
            city: "Paris",
            state: "",
            country: "France",
            postalCode: "75004",
            status: "DRAFT",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: host.userId,
            type: "VILLA",
            name: "Tuscan Vineyard Estate",
            description: "Authentic stone farmhouse bordered by historic cypress trees.",
            checkInTime: new Date("1998-12-24T16:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T10:00:00.000Z"),
            contactPhone: "+39-055-5550122",
            addressLine1: "Via di Vignamaggio 15",
            city: "Greve in Chianti",
            state: "Florence",
            country: "Italy",
            postalCode: "50022",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        },
        {
            ownerId: admin.userId,
            type: "APARTMENT",
            name: "Berlin Industrial Flat",
            description: "Spacious minimalist warehouse conversion located in Kreuzberg.",
            checkInTime: new Date("1998-12-24T14:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+49-30-5555-0141",
            addressLine1: "Oranienstraße 185",
            city: "Berlin",
            state: "Berlin",
            country: "Germany",
            postalCode: "10999",
            status: "APPROVED",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: host.userId,
            type: "HOMESTAY",
            name: "Reykjavik Geothermal Oasis",
            description: "Sleek scandinavian home with an outdoor natural hot tub.",
            checkInTime: new Date("1998-12-24T16:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "+354-555-0199",
            addressLine1: "Laugavegur 81",
            city: "Reykjavik",
            state: "Capital Region",
            country: "Iceland",
            postalCode: "101",
            status: "APPROVED",
            bookingMode: "ENTIRE_PROPERTY",
        },
        {
            ownerId: host.userId,
            type: "HOTEL",
            name: "Dubai Marina Jewels",
            description: "Opulent executive suites featuring full access to a private marina.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T12:00:00.000Z"),
            contactPhone: "+971-4-555-0167",
            addressLine1: "Marina Promenade Tower B",
            city: "Dubai",
            state: "Dubai",
            country: "UAE",
            postalCode: "00000",
            status: "APPROVED",
            bookingMode: "PER_ROOM",
        },
        {
            ownerId: host.userId,
            type: "HOMESTAY",
            name: "Costa Rica Jungle Treehouse",
            description: "Immersive open-air canopy living deep inside a wildlife reserve.",
            checkInTime: new Date("1998-12-24T15:00:00.000Z"),
            checkOutTime: new Date("1998-12-24T11:00:00.000Z"),
            contactPhone: "",
            addressLine1: "Km 4 Road to Manuel Antonio",
            city: "Quepos",
            state: "Puntarenas",
            country: "Costa Rica",
            postalCode: "60601",
            status: "DRAFT",
            bookingMode: "ENTIRE_PROPERTY",
        }
    ];
    const listingCount = await prisma.listing.createMany({
        data: [
            ...listings,
        ]
    })
    console.log('Seeded - ', listingCount + 3, ' listings');


    console.log('📸 Seeding listing images..');
    const listingImages = [
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_ext_01",
            caption: "Dramatic drone shot of the villa over the Pacific Ocean",
            isThumbnail: true,
            displayOrder: 0
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_pool_02",
            caption: "Infinity edge swimming pool blending into the horizon",
            isThumbnail: false,
            displayOrder: 1
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_living_03",
            caption: "Sunlit living space with floor-to-ceiling glass retractable walls",
            isThumbnail: false, displayOrder: 2
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_bed_04",
            caption: "Master suite featuring a king-size bed and private balcony access",
            isThumbnail: false, displayOrder: 3
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_bath_05",
            caption: "Spa-like marble bathroom with deep freestanding soaking tub",
            isThumbnail: false, displayOrder: 4
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_kitchen_06",
            caption: "Chef's kitchen outfitted with high-end professional appliances",
            isThumbnail: false, displayOrder: 5
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_deck_07",
            caption: "Outdoor lounge deck equipped with a fire pit for evening relaxation",
            isThumbnail: false, displayOrder: 6
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_beach_08",
            caption: "Direct private staircase leading straight down to the sandy beach",
            isThumbnail: false, displayOrder: 7
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_night_09",
            caption: "Stunning architectural exterior illumination after dusk",
            isThumbnail: false, displayOrder: 8
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_gym_10",
            caption: "Private fitness studio overlooking the coastline scenery",
            isThumbnail: false, displayOrder: 9
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_garage_11",
            caption: "Spacious secure multi-car parking garage structure with EV charging stations",
            isThumbnail: false, displayOrder: 10
        },
        {
            listingId: listing1.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "malibu_garden_12",
            caption: "Manicured lawn area dotted with majestic architectural palm trees",
            isThumbnail: false, displayOrder: 11
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_view_01",
            caption: "Incredible view overlooking the neon lights of Shinjuku at night",
            isThumbnail: true, displayOrder: 0
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_room_02",
            caption: "Minimalist studio bedroom utilizing functional smart furniture",
            isThumbnail: false, displayOrder: 1
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_bed_03",
            caption: "Comfortable platform bed with traditional linen elements",
            isThumbnail: false, displayOrder: 2
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_kitchen_04",
            caption: "Compact galley kitchen stocked with complimentary Japanese teas",
            isThumbnail: false, displayOrder: 3
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_bath_05",
            caption: "Deep dynamic micro-soaking tub complete with digital temperature display",
            isThumbnail: false, displayOrder: 4
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_desk_06",
            caption: "Dedicated workspace with high-speed fiber internet infrastructure",
            isThumbnail: false, displayOrder: 5
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_entrance_07",
            caption: "Traditional Genkan entryway featuring clean wooden architectural lines",
            isThumbnail: false, displayOrder: 6
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_lobby_08",
            caption: "Secure high-rise residential building reception desk",
            isThumbnail: false, displayOrder: 7
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_tower_09",
            caption: "Dramatic geometric view looking directly up the exterior tower walls",
            isThumbnail: false, displayOrder: 8
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_balcony_10",
            caption: "Private standing balcony perfect for watching morning cityscapes",
            isThumbnail: false, displayOrder: 9
        },
        {
            listingId: listing2.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "tokyo_subway_11",
            caption: "Neighborhood context snapshot indicating nearby subway entrances",
            isThumbnail: false, displayOrder: 10
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_ext_01",
            caption: "Classic iconic white-washed architectural structure beneath clear blue skies",
            isThumbnail: true, displayOrder: 0
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_pool_02",
            caption: "Private plunge pool with panoramic caldera volcanic crater views",
            isThumbnail: false, displayOrder: 1
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_living_03",
            caption: "Cave-style arched living room architecture staying naturally cool",
            isThumbnail: false, displayOrder: 2
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_bed_04",
            caption: "Built-in plaster queen size bed showcasing elegant simple luxury",
            isThumbnail: false, displayOrder: 3
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_patio_05",
            caption: "Al-fresco dining table situated under a rustic wooden pergola structure",
            isThumbnail: false, displayOrder: 4
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_bath_06",
            caption: "Plaster-carved walk-in rain shower matching Cycladic styles",
            isThumbnail: false, displayOrder: 5
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_sunset_07",
            caption: "World-famous golden hour sunset view viewable straight from the room",
            isThumbnail: false, displayOrder: 6
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_steps_08",
            caption: "Winding stone walkways leading directly down toward historic Oia village",
            isThumbnail: false, displayOrder: 7
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_lounge_09",
            caption: "Comfortable sun loungers placed perfectly next to the water deck",
            isThumbnail: false, displayOrder: 8
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_door_10",
            caption: "Bright signature blue accent door presenting gorgeous coastal backgrounds",
            isThumbnail: false, displayOrder: 9
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_church_11",
            caption: "Scenic walking trails passing by iconic blue-domed local churches",
            isThumbnail: false, displayOrder: 10
        },
        {
            listingId: listing3.listingId,
            imageUrl: "https://unsplash.com",
            publicId: "greece_night_12",
            caption: "Calm glowing evening view across the lit hillside buildings",
            isThumbnail: false, displayOrder: 11
        }
    ]
    const listingImageCount = await prisma.listingImage.createMany({
        data: [
            ...listingImages,
        ]
    })
    console.log('Seeded - ', listingImageCount, ' listing images');

    console.log('🛏️ Seeding rooms...');
    const room1 = await prisma.room.create({
        data: {
            listingId: listing1.listingId,
            name: "Pacific Horizon Master Suite",
            description: "Premium top-floor suite featuring an open layout, custom walk-in dressing area, and absolute panoramic ocean scenery.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(250.00),
            area: 65.5,
            areaUnit: "SQ_FT",
            isActive: true
        }
    });
    const room2 = await prisma.room.create({
        data: {
            listingId: listing1.listingId,
            name: "Sunset Crest Double Room",
            description: "Elegant western-facing room configuration presenting gorgeous golden hour environments every single evening.",
            roomType: "SINGLE",
            maxGuests: 4,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(180.00),
            area: 45.0,
            areaUnit: "SQ_M",
            isActive: true
        }
    });
    const room3 = await prisma.room.create({
        data: {
            listingId: listing2.listingId,
            name: "Tokyo Tower View Executive",
            description: "High-floor panorama framing neon skyscraper configurations with extreme clarity.",
            roomType: "SUITE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(160.00),
            area: 42.0,
            areaUnit: "SQ_M",
            isActive: true
        }
    });
    const room4 = await prisma.room.create({
        data: {
            listingId: listing2.listingId,
            name: "Zen Minimalist Tatami Single",
            description: "Traditional woven rush mats containing premium ergonomic floor futon configurations.",
            roomType: "SINGLE",
            maxGuests: 1,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(75.00),
            area: 22.0,
            areaUnit: "SQ_M",
            isActive: true
        }
    });
    const room5 = await prisma.room.create({
        data: {
            listingId: listing3.listingId,
            name: "Caldera Edge Infinity Suite",
            description: "Carved directly out of cliff faces, offering a private whitewashed veranda step-out over the sea.",
            roomType: "SUITE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(290.00),
            area: 55.0,
            areaUnit: "SQ_M",
            isActive: true
        }
    });
    const rooms = [
        {
            listingId: listing1.listingId,
            name: "Coastal Breeze Studio Flat",
            description: "Self-contained sub-level wing containing its own breakfast bar installation and direct sliding track access towards the grass lawn.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(150.00),
            area: 40.2,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Ocean View King Room",
            description: "Bright open bedroom workspace displaying stunning morning beach breaks.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(190.00),
            area: 38.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Tidewater Garden Suite",
            description: "Peaceful standalone landscape view room option maintaining complete ground flora isolation.",
            roomType: "SUITE",
            maxGuests: 3,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(165.00),
            area: 50.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "The Penthouse Oasis",
            description: "The absolute crown jewel floor containing automated ceiling shades and a private outdoor wrap terrace setup.",
            roomType: "SUITE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 2,
            basePrice: new Prisma.Decimal(350.00),
            area: 88.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Marina Deck Room",
            description: "Lower level setup containing classic nautical hardware designs.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(140.00),
            area: 32.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Seaside Family Quarters",
            description: "Interconnected multi-bed layout designed safely for parents traveling alongside small children.",
            roomType: "SINGLE",
            maxGuests: 5,
            bedrooms: 2,
            beds: 3,
            bathrooms: 2,
            basePrice: new Prisma.Decimal(280.00),
            area: 72.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Surfside Minimalist Studio",
            description: "Streamlined modern architectural space engineered for active dynamic travelers.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(130.00),
            area: 35.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "The Atrium Solarium Suite",
            description: "Gorgeous glass roofing grid panels inviting maximum natural daytime light distributions.",
            roomType: "SUITE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(210.00),
            area: 55.4,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Coral Reef Twin Quarters",
            description: "Cozy interior twin single design layout maximizing restful travel breaks.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(125.00),
            area: 30.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "The Lookout Lookout Loft",
            description: "Elevated high-ceiling timber structural deck space containing telescope apparatus systems.",
            roomType: "DELUXE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(175.00),
            area: 42.1,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Nautilus Corner Suite",
            description: "Premium wrap-around glass frame displaying expansive seaside parameters.",
            roomType: "SUITE",
            maxGuests: 3,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(225.00),
            area: 58.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "Beachcomber Ground Cabana",
            description: "Step directly out onto sandy shore trails from your exterior framing threshold.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(200.00),
            area: 39.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing1.listingId,
            name: "The Sanctuary Hideaway",
            description: "Isolated structural extension ensuring total peace and soundproof capabilities.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(160.00),
            area: 36.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Cyberpunk Studio Pod",
            description: "High-tech workspace layout featuring adjustable smart LED accents and mechanical desks.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(95.00),
            area: 28.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Metro Central Double Loft",
            description: "Efficient vertical split design utilizing space to comfortably host multiple guests.",
            roomType: "DELUXE",
            maxGuests: 4,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(135.00),
            area: 36.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Shinjuku Skyline Studio",
            description: "Compact corner configuration overlooking vibrant train system crossings below.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(110.00),
            area: 31.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "The Imperial Double Suite",
            description: "Luxury layout containing handcrafted oak finishes and deep soaking ceramic wash units.",
            roomType: "SUITE",
            maxGuests: 3,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(195.00),
            area: 50.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Neon Alley Capsule Room",
            description: "Ultra-compact single layout intended for hyper-efficient urban explorers.",
            roomType: "SINGLE",
            maxGuests: 1,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(65.00),
            area: 18.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Edo Heritage Twin",
            description: "Classic styling elements matching standard cultural aesthetics accurately.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(90.00),
            area: 26.4,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "The Origami Loft Space",
            description: "Geometric architecture patterns optimizing spatial overhead dimensions perfectly.",
            roomType: "DELUXE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(120.00),
            area: 34.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Metropolitan Business Hub",
            description: "Tailored specifically towards corporate remote operations with printing equipment infrastructure.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(115.00),
            area: 29.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Chofu Garden Ground Studio",
            description: "Low-level alternative containing stone moss design landscape thresholds.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(105.00),
            area: 33.2,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "The Shibuya Vista Suite",
            description: "Expansive west-facing grid showing city life transitions seamlessly.",
            roomType: "SUITE",
            maxGuests: 4,
            bedrooms: 2,
            beds: 2,
            bathrooms: 1.5,
            basePrice: new Prisma.Decimal(210.00),
            area: 58.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing2.listingId,
            name: "Asakusa Traditional Restroom",
            description: "Quiet, heavily insulated sanctuary built for complete urban relaxation resets.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(88.00),
            area: 25.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Aegean Sea View Classic",
            description: "Arched plaster architecture layout containing volcanic structural design nuances.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(195.00),
            area: 34.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Cycladic Plaster Cave Loft",
            description: "Distinctive high mezzanine platform structure keeping natural temperature balances fully stable.",
            roomType: "DELUXE",
            maxGuests: 3,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(220.00),
            area: 44.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "White Windmill Studio",
            description: "Circular perimeter building configuration matching historical landmark shapes closely.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(170.00),
            area: 38.2,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Oia Sunset Superior Room",
            description: "Prime unblocked positioning focused directly on global benchmark evening horizons.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(240.00),
            area: 36.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Thira Azure Family Suite",
            description: "Grand master suite connecting distinct private living areas cleanly.",
            roomType: "SUITE",
            maxGuests: 5,
            bedrooms: 2,
            beds: 3,
            bathrooms: 2,
            basePrice: new Prisma.Decimal(380.00),
            area: 75.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Volcanic Rock Ground Studio",
            description: "Dark structural stone interior elements contrasting beautifully with bright outside highlights.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(160.00),
            area: 41.5,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "The Mediterranean Loft Haven",
            description: "Relaxed open structural architecture dressed cleanly in linen styling formats.",
            roomType: "DELUXE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(205.00),
            area: 46.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Amoudi Bay Downstream Suite",
            description: "Lower tier cliff setup providing near proximity towards water trail structures.",
            roomType: "SUITE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(260.00),
            area: 52.1,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Sapphire Terrace Twin Room",
            description: "Bright room option looking out over deep cobalt blue horizons.",
            roomType: "SINGLE",
            maxGuests: 2,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(185.00),
            area: 33.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "The Pelican Nest Studio",
            description: "Cozy intimate space perfect for long-term remote working getaways.",
            roomType: "STUDIO",
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            basePrice: new Prisma.Decimal(150.00),
            area: 30.0,
            areaUnit: "SQ_M",
            isActive: true
        },
        {
            listingId: listing3.listingId,
            name: "Atlantis Panoramic Master",
            description: "Expansive layout offering 270-degree view lines of the entire island arc.",
            roomType: "SUITE",
            maxGuests: 3,
            bedrooms: 1,
            beds: 2,
            bathrooms: 1.5,
            basePrice: new Prisma.Decimal(310.00),
            area: 68.0,
            areaUnit: "SQ_M",
            isActive: true
        }
    ];
    const roomCount = await prisma.room.createMany({
        data: [
            ...rooms,
        ]
    });
    console.log('Seeded - ', roomCount + 5, ' room data');

    console.log('🖼️ Seeding room images...');
    const roomImages = [
        {
            roomId: room1.roomId,
            altText: 'room1_img1',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img1',
            displayOrder: 0
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img2',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img2',
            displayOrder: 1
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img3',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img3',
            displayOrder: 2
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img4',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img4',
            displayOrder: 3
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img5',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img5',
            displayOrder: 4
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img6',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img6',
            displayOrder: 5
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img7',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img7',
            displayOrder: 6
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img8',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img8',
            displayOrder: 7
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img9',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img9',
            displayOrder: 8
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img10',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img10',
            displayOrder: 9
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img11',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img11',
            displayOrder: 10
        },
        {
            roomId: room1.roomId,
            altText: 'room1_img12',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room1/img12',
            displayOrder: 11
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img1',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img1',
            displayOrder: 0
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img2',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img2',
            displayOrder: 1
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img3',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img3',
            displayOrder: 2
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img4',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img4',
            displayOrder: 3
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img5',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img5',
            displayOrder: 4
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img6',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img6',
            displayOrder: 5
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img7',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img7',
            displayOrder: 6
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img8',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img8',
            displayOrder: 7
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img9',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img9',
            displayOrder: 8
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img10',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img10',
            displayOrder: 9
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img11',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img11',
            displayOrder: 10
        },
        {
            roomId: room2.roomId,
            altText: 'room2_img12',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room2/img12',
            displayOrder: 11
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img1',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img1',
            displayOrder: 0
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img2',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img2',
            displayOrder: 1
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img3',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img3',
            displayOrder: 2
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img4',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img4',
            displayOrder: 3
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img5',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img5',
            displayOrder: 4
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img6',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img6',
            displayOrder: 5
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img7',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img7',
            displayOrder: 6
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img8',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img8',
            displayOrder: 7
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img9',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img9',
            displayOrder: 8
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img10',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img10',
            displayOrder: 9
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img11',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img11',
            displayOrder: 10
        },
        {
            roomId: room3.roomId,
            altText: 'room3_img12',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room3/img12',
            displayOrder: 11
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img1',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img1',
            displayOrder: 0
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img2',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img2',
            displayOrder: 1
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img3',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img3',
            displayOrder: 2
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img4',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img4',
            displayOrder: 3
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img5',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img5',
            displayOrder: 4
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img6',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img6',
            displayOrder: 5
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img7',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img7',
            displayOrder: 6
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img8',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img8',
            displayOrder: 7
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img9',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img9',
            displayOrder: 8
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img10',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img10',
            displayOrder: 9
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img11',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img11',
            displayOrder: 10
        },
        {
            roomId: room4.roomId,
            altText: 'room4_img12',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room4/img12',
            displayOrder: 11
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img1',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img1',
            displayOrder: 0
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img2',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img2',
            displayOrder: 1
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img3',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img3',
            displayOrder: 2
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img4',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img4',
            displayOrder: 3
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img5',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img5',
            displayOrder: 4
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img6',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img6',
            displayOrder: 5
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img7',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img7',
            displayOrder: 6
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img8',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img8',
            displayOrder: 7
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img9',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img9',
            displayOrder: 8
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img10',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img10',
            displayOrder: 9
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img11',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img11',
            displayOrder: 10
        },
        {
            roomId: room5.roomId,
            altText: 'room5_img12',
            imageUrl: 'https://unsplash.com',
            publicId: 'seed/room5/img12',
            displayOrder: 11
        }
    ]
    const roomImageCount = await prisma.roomImage.createMany({
        data: [
            ...roomImages,
        ]
    })
    console.log('Seeded - ', roomImageCount, ' room images');

    console.log('Seeding bookings...');
    const booking1 = await prisma.booking.create({
        data:
        {
            bookingReference: "BK-2026-1001",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 3,
            checkIn: new Date("2026-07-06T15:00:00Z"),
            checkOut: new Date("2026-07-09T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 450.0,
            bookingAmount: 450.0,
            paidAmount: 450.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-07-09T11:00:00Z')
        }
    })
    const booking2 = await prisma.booking.create({
        data:
        {
            bookingReference: "BK-2026-1002",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: host.userId,
            guests: 1,
            checkIn: new Date("2026-08-19T15:00:00Z"),
            checkOut: new Date("2026-08-24T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 750.0,
            bookingAmount: 750.0,
            paidAmount: 750.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        }
    })
    const booking3 = await prisma.booking.create({
        data:
        {
            bookingReference: "BK-2026-1003",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 2,
            checkIn: new Date("2026-08-08T15:00:00Z"),
            checkOut: new Date("2026-08-14T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 900.0,
            bookingAmount: 900.0,
            paidAmount: 900.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        }
    })
    const booking4 = await prisma.booking.create({
        data: {
            bookingReference: "BK-2026-1004",
            roomId: room5.roomId,
            roomName: "Caldera Edge Infinity Suite",
            listingId: listing3.listingId,
            listingName: "Santorini Sunset Horizon",
            thumbnailUrl: "https://unsplash.com",
            guestId: host.userId,
            guests: 2,
            checkIn: new Date("2026-08-01T15:00:00Z"),
            checkOut: new Date("2026-08-07T11:00:00Z"),
            pricePerNight: 220.0,
            totalPrice: 1320.0,
            bookingAmount: 1320.0,
            paidAmount: 0.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "REFUNDED",
            status: "CANCELLED",
            cancellationReason: 'Guest changed plans',
            cancelledAt: new Date('2026-07-27T10:00:00Z'),
            completedAt: null
        }
    });
    const booking5 = await prisma.booking.create({
        data: {
            bookingReference: "BK-2026-1005",
            roomId: room2.roomId,
            roomName: "Sunset Crest Double Room",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 3,
            checkIn: new Date("2026-07-10T15:00:00Z"),
            checkOut: new Date("2026-07-13T11:00:00Z"),
            pricePerNight: 180.0,
            totalPrice: 540.0,
            bookingAmount: 540.0,
            paidAmount: 540.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "AWAITING_PAYMENT",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-07-13T11:00:00Z')
        }
    })
    const booking6 = await prisma.booking.create({
        data: {
            bookingReference: "BK-2026-1006",
            roomId: room3.roomId,
            roomName: "Tokyo Tower View Executive",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 1,
            checkIn: new Date("2026-07-23T15:00:00Z"),
            checkOut: new Date("2026-07-25T11:00:00Z"),
            pricePerNight: 85.0,
            totalPrice: 170.0,
            bookingAmount: 70.0,
            paidAmount: 70.0,
            remainingAmount: 100.0,
            paymentOption: "BOOK_ONLY",
            paymentStatus: "PENDING",
            status: "CHECKED_IN",
            cancellationReason: 'Guest changed plans',
            cancelledAt: new Date('2026-07-18T10:00:00Z'),
            completedAt: null
        }
    })
    const booking7 = await prisma.booking.create({
        data: {
            bookingReference: "BK-2026-1007",
            roomId: room5.roomId,
            roomName: "Caldera Edge Infinity Suite",
            listingId: listing3.listingId,
            listingName: "Santorini Sunset Horizon",
            thumbnailUrl: "https://unsplash.com",
            guestId: admin.userId,
            guests: 1,
            checkIn: new Date("2026-08-02T15:00:00Z"),
            checkOut: new Date("2026-08-08T11:00:00Z"),
            pricePerNight: 220.0,
            totalPrice: 1320.0,
            bookingAmount: 1320.0,
            paidAmount: 660.0,
            remainingAmount: 660.0,
            paymentOption: "BOOK_ONLY",
            paymentStatus: "PARTIALLY_PAID",
            status: "CHECKED_OUT",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        }
    })
    const bookings = [
        {
            bookingReference: "BK-2026-1008",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: host.userId,
            guests: 3,
            checkIn: new Date("2026-08-24T15:00:00Z"),
            checkOut: new Date("2026-08-30T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 900.0,
            bookingAmount: 900.0,
            paidAmount: 0.0,
            remainingAmount: 900.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PENDING",
            status: "CANCELLED",
            cancellationReason: 'Guest changed plans',
            cancelledAt: new Date('2026-08-19T10:00:00Z'),
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1009",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 2,
            checkIn: new Date("2026-07-12T15:00:00Z"),
            checkOut: new Date("2026-07-14T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 300.0,
            bookingAmount: 300.0,
            paidAmount: 300.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-07-14T11:00:00Z')
        },
        {
            bookingReference: "BK-2026-1010",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 3,
            checkIn: new Date("2026-08-02T15:00:00Z"),
            checkOut: new Date("2026-08-06T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 600.0,
            bookingAmount: 600.0,
            paidAmount: 600.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-08-06T11:00:00Z')
        },
        {
            bookingReference: "BK-2026-1011",
            roomId: room3.roomId,
            roomName: "Tokyo Tower View Executive",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "https://unsplash.com",
            guestId: admin.userId,
            guests: 2,
            checkIn: new Date("2026-08-29T15:00:00Z"),
            checkOut: new Date("2026-09-02T11:00:00Z"),
            pricePerNight: 85.0,
            totalPrice: 340.0,
            bookingAmount: 340.0,
            paidAmount: 340.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1012",
            roomId: room5.roomId,
            roomName: "Caldera Edge Infinity Suite",
            listingId: listing3.listingId,
            listingName: "Santorini Sunset Horizon",
            thumbnailUrl: "https://unsplash.com",
            guestId: host.userId,
            guests: 2,
            checkIn: new Date("2026-08-03T15:00:00Z"),
            checkOut: new Date("2026-08-08T11:00:00Z"),
            pricePerNight: 220.0,
            totalPrice: 1100.0,
            bookingAmount: 1100.0,
            paidAmount: 0.0,
            remainingAmount: 1100.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PENDING",
            status: "CANCELLED",
            cancellationReason: 'Guest changed plans',
            cancelledAt: new Date('2026-07-29T10:00:00Z'),
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1013",
            roomId: room3.roomId,
            roomName: "Tokyo Tower View Executive",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 2,
            checkIn: new Date("2026-06-09T15:00:00Z"),
            checkOut: new Date("2026-06-13T11:00:00Z"),
            pricePerNight: 85.0,
            totalPrice: 340.0,
            bookingAmount: 340.0,
            paidAmount: 340.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-06-13T11:00:00Z')
        },
        {
            bookingReference: "BK-2026-1014",
            roomId: room3.roomId,
            roomName: "Tokyo Tower View Executive",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "https://unsplash.com",
            guestId: user.userId,
            guests: 2,
            checkIn: new Date("2026-08-16T15:00:00Z"),
            checkOut: new Date("2026-08-20T11:00:00Z"),
            pricePerNight: 85.0,
            totalPrice: 340.0,
            bookingAmount: 340.0,
            paidAmount: 340.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-08-20T11:00:00Z')
        },
        {
            bookingReference: "BK-2026-1015",
            roomId: room4.roomId,
            roomName: "Zen Minimalist Tatami Single",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "unsplash.com",
            guestId: user.userId,
            guests: 4,
            checkIn: new Date("2026-06-23T15:00:00Z"),
            checkOut: new Date("2026-06-27T11:00:00Z"),
            pricePerNight: 75.0,
            totalPrice: 300.0,
            bookingAmount: 300.0,
            paidAmount: 300.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-06-27T11:00:00Z')
        },
        {
            bookingReference: "BK-2026-1016",
            roomId: room2.roomId,
            roomName: "Sunset Crest Double Room",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "unsplash.com",
            guestId: host.userId,
            guests: 3,
            checkIn: new Date("2026-08-18T15:00:00Z"),
            checkOut: new Date("2026-08-23T11:00:00Z"),
            pricePerNight: 180.0,
            totalPrice: 900.0,
            bookingAmount: 900.0,
            paidAmount: 0.0,
            remainingAmount: 900.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PENDING",
            status: "AWAITING_PAYMENT",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1017",
            roomId: room3.roomId,
            roomName: "Tokyo Tower View Executive",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "unsplash.com",
            guestId: host.userId,
            guests: 2,
            checkIn: new Date("2026-08-09T15:00:00Z"),
            checkOut: new Date("2026-08-14T11:00:00Z"),
            pricePerNight: 85.0,
            totalPrice: 425.0,
            bookingAmount: 425.0,
            paidAmount: 425.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1018",
            roomId: room1.roomId,
            roomName: "Pacific Horizon Master Suite",
            listingId: listing1.listingId,
            listingName: "Malibu Cliffside Retreat",
            thumbnailUrl: "unsplash.com",
            guestId: host.userId,
            guests: 2,
            checkIn: new Date("2026-08-31T15:00:00Z"),
            checkOut: new Date("2026-09-05T11:00:00Z"),
            pricePerNight: 150.0,
            totalPrice: 750.0,
            bookingAmount: 750.0,
            paidAmount: 375.0,
            remainingAmount: 375.0,
            paymentOption: "BOOK_ONLY",
            paymentStatus: "PARTIALLY_PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1019",
            roomId: room4.roomId,
            roomName: "Zen Minimalist Tatami Single",
            listingId: listing2.listingId,
            listingName: "Shinjuku Neon Skybox",
            thumbnailUrl: "unsplash.com",
            guestId: host.userId,
            guests: 4,
            checkIn: new Date("2026-08-11T15:00:00Z"),
            checkOut: new Date("2026-08-15T11:00:00Z"),
            pricePerNight: 75.0,
            totalPrice: 300.0,
            bookingAmount: 300.0,
            paidAmount: 300.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "CONFIRMED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: null
        },
        {
            bookingReference: "BK-2026-1020",
            roomId: room5.roomId,
            roomName: "Caldera Edge Infinity Suite",
            listingId: listing3.listingId,
            listingName: "Santorini Sunset Horizon",
            thumbnailUrl: "unsplash.com",
            guestId: admin.userId,
            guests: 3,
            checkIn: new Date("2026-06-19T15:00:00Z"),
            checkOut: new Date("2026-06-23T11:00:00Z"),
            pricePerNight: 220.0,
            totalPrice: 880.0,
            bookingAmount: 880.0,
            paidAmount: 880.0,
            remainingAmount: 0.0,
            paymentOption: "PAY_NOW",
            paymentStatus: "PAID",
            status: "COMPLETED",
            cancellationReason: null,
            cancelledAt: null,
            completedAt: new Date('2026-06-23T11:00:00Z')
        }
    ];
    const bookingCount = await prisma.booking.createMany({
        data: [
            ...bookings,
        ]
    })
    console.log('Seeded - ', bookingCount + 7, ' booking data');


    console.log('✍️ Seeding reviews...');
    const review1 = await prisma.review.create({
        data: {
            bookingId: booking1.bookingId,
            listingId: booking1.listingId,
            guestId: booking1.guestId,
            rating: 5,
            comment: "Absolutely loved our stay! The view was breathtaking and the amenities were top-notch. Highly recommend!",
        }
    });
    console.log('Seeded - ', 1, ' reviews');

    console.log('✅ All models successfully seeded!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Master seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });