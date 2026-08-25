export const publicListingSummarySelect = {
    listingId: true,
    type: true,
    name: true,
    description: true,

    city: true,
    state: true,
    country: true,
    landmark: true,

    thumbnailUrl: true,

    bookingMode: true,
    isActive: true,

    averageRating: true,
    reviewCount: true,
};

export const publicListingDetailSelect = {
    listingId: true,
    type: true,
    name: true,
    description: true,

    checkInTime: true,
    checkOutTime: true,

    contactPhone: true,
    contactEmail: true,

    addressLine1: true,
    addressLine2: true,
    city: true,
    state: true,
    country: true,
    postalCode: true,
    landmark: true,

    latitude: true,
    longitude: true,

    thumbnailUrl: true,

    bookingMode: true,
    isActive: true,

    averageRating: true,
    reviewCount: true,
};

export const hostListingSelect = {
    images: true,

    amenities: {
        include: {
            amenity: true,
        },
    },

    rooms: {
        include: {
            images: true,
        },
    }
}

export const adminListingSelect = {
    images: true,

    amenities: {
        include: {
            amenity: true,
        },
    },

    rooms: {
        include: {
            images: true,
            amenities: {
                include: {
                    amenity: true,
                },
            },
        },
    },

    reviews: {
        include: {
            guest: {
                select: {
                    firstname: true,
                    lastname: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    },
};

// fix
export const getListingDataForSubmit = {

}