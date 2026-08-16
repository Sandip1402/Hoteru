export const publicListingInclude = {
    images: {
        orderBy: {
            displayOrder: "asc",
        },
    },

    amenities: {
        include: {
            amenity: true,
        },
    },

    rooms: {
        where: {
            isActive: true,
        },
        include: {
            images: {
                orderBy: {
                    displayOrder: "asc",
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
    }
}

export const hostListingInclude = {
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

export const adminListingInclude = {
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

export const getListingDataForSubmit = {
    
}