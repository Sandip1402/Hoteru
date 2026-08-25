import { prisma } from "../lib/prisma.js"
import { publicListingDetailSelect } from "../utils/listing.helper.js";
import {
    getOrderBy,
    applyDestinationFilter,
    applyRatingFilter,
    applyAmenityFilter,
    applyRoomFilter,
} from "../utils/search.helper.js";

export const searchListings = async ({
    destination,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    amenities,
    rating,
    page,
    limit,
    sort,
}) => {
    const where = {
        status: "APPROVED",
    };

    applyDestinationFilter(where, destination);

    applyRatingFilter(where, rating);

    applyAmenityFilter(where, amenities);

    applyRoomFilter(where, {
        guests,
        minPrice,
        maxPrice,
        checkIn,
        checkOut,
    });

    const listings = await prisma.listing.findMany({
        where,
        include: publicListingDetailSelect,
        orderBy: getOrderBy(sort),
        skip: (page - 1) * limit,
        take: limit,
    });

    const total = await prisma.listing.count({
        where,
    });

    return {
        listings,

        // filters: {
        //     destination,
        //     checkIn,
        //     checkOut,
        //     guests,
        //     minPrice,
        //     maxPrice,
        //     rating,
        //     amenities: amenityIds,
        //     page,
        //     limit,
        //     sort
        // },

        pagination: {
            page,
            limit,
            total,
            totalPages:
                Math.ceil(total / limit),
        },
    };
};

export const getSearchSuggestions = async (destination) => {
    const where = {
        status: "APPROVED",
    };

    applyDestinationFilter(where, destination);

    const locations = await prisma.listing.findMany({
        where,

        select: {
            name: true,
            city: true,
            state: true,
            country: true,
        },

        take: 10,
    });

    const suggestions = [
        ...new Map(
            locations
                .flatMap((item) => [
                    item.name && {
                        type: "listing",
                        value: item.name,
                    },
                    item.city && {
                        type: "city",
                        value: item.city,
                    },
                    item.state && {
                        type: "state",
                        value: item.state,
                    },
                    item.country && {
                        type: "country",
                        value: item.country,
                    },
                ])
                .filter(Boolean)
                .map((item) => [`${item.type}:${item.value}`, item])
        ).values(),
    ];

    return suggestions;
};