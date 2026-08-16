export const parseAmenityIds = (amenities) => {
    if (!amenities) return [];

    return amenities
        .split(",")
        .map(Number)
        .filter(Number.isInteger);
};

export const getOrderBy = (sort) => {
    const orderByMap = {
        newest: {
            createdAt: "desc",
        },

        oldest: {
            createdAt: "asc",
        },

        rating_desc: {
            averageRating: "desc",
        },

        rating_asc: {
            averageRating: "asc",
        },
    };

    return orderByMap[sort] ?? orderByMap.newest;
};

export const applyDestinationFilter = (
    where,
    destination
) => {
    if (!destination) return;

    where.OR = [
        {
            name: {
                contains: destination,
                mode: "insensitive",
            },
        },
        {
            city: {
                contains: destination,
                mode: "insensitive",
            },
        },
        {
            state: {
                contains: destination,
                mode: "insensitive",
            },
        },
        {
            country: {
                contains: destination,
                mode: "insensitive",
            },
        },
    ];
};

export const applyRatingFilter = (
    where,
    rating
) => {
    if (!rating) return;

    where.averageRating = {
        gte: rating,
    };
};

export const applyAmenityFilter = (
    where,
    amenities
) => {

    const amenityIds =
        parseAmenityIds(amenities);

    if (!amenityIds.length) return;

    // preserves other AND filters
    where.AND ??= [];

    where.AND.push(
        ...amenityIds.map((amenityId) => ({
            amenities: {
                some: {
                    amenityId,
                },
            },
        }))
    );
};

const buildAvailabilityFilter = (
    checkIn,
    checkOut
) => {

    if (!checkIn || !checkOut) {
        return;
    }

    return {
        none: {
            status: {
                in: [
                    "CONFIRMED",
                    "CHECKED_IN",
                ],
            },
            AND: [
                {
                    checkIn: {
                        lt: checkOut,
                    },
                },
                {
                    checkOut: {
                        gt: checkIn,
                    },
                },
            ],
        },
    };
};

export const applyRoomFilter = (
    where,
    {
        guests,
        minPrice,
        maxPrice,
        checkIn,
        checkOut,
    }
) => {

    const roomWhere = {};

    if (guests) {
        roomWhere.maxGuests = {
            gte: guests ?? 1,
        };
    }

    if (minPrice || maxPrice) {
        roomWhere.baseprice = {
            ...(minPrice && {
                gte: minPrice,
            }),
            ...(maxPrice && {
                lte: maxPrice,
            }),
        };
    }

    const availability =
        buildAvailabilityFilter(
            checkIn,
            checkOut
        );

    if (availability) {
        roomWhere.bookings = availability;
    }

    where.rooms = {
        some: roomWhere,
    };
};