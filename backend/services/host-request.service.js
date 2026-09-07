import { prisma } from "../lib/prisma.js";
import { assignHostRoleInAuth0 } from "../auth/auth0.js";
import AppError from "../utils/app-error.js";

export const createHostRequest = async (userId, data) => {
    const { phoneNumber, governmentIdUrl, businessName, governmentIdType } = data;

    const existingRequest = await prisma.hostRequest.findFirst({
        where: {
            userId,
            status: "PENDING",
        },
    });

    if (existingRequest) {
        throw new AppError(400, "You already have a pending request.");
    }

    return prisma.hostRequest.create({
        data: {
            userId,
            phoneNumber,
            governmentIdUrl,
            governmentIdType,
            businessName
        },
    });
};

export const getHostProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            userId,
        },
        select: {
            userId: true,
            image: true,
            firstname: true,
            lastname: true,
            email: true,
            DOB: true,
            country: true,

            HostRequests: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
                select: {
                    requestId: true,
                    phoneNumber: true,
                    governmentIdType: true,
                    businessName: true,
                    status: true,
                    createdAt: true,
                    verifiedAt: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    const hostRequest = user.HostRequests[0] || null;

    return {
        user: {
            userId: user.userId,
            image: user.image,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            DOB: user.DOB,
            country: user.country,
        },

        host: hostRequest
            ? {
                  requestId: hostRequest.requestId,
                  phoneNumber: hostRequest.phoneNumber,
                  governmentIdType: hostRequest.governmentIdType,
                  businessName: hostRequest.businessName,
                  status: hostRequest.status,
                  createdAt: hostRequest.createdAt,
                  verifiedAt: hostRequest.verifiedAt,
              }
            : null,
    };
};

export const getPendingHostRequests = async () => {
    return prisma.hostRequest.findMany({
        where: {
            status: "PENDING",
        },
        orderBy: {
            createdAt: "asc",
        }
    })
}

export const processHostRequest = async (
    requestId,
    adminId,
    action,
    adminNotes,
) => {
    if (!["APPROVE", "REJECT"].includes(action)) {
        throw new AppError(400, "Invalid action");
    }

    const hostRequest = await prisma.hostRequest.findUnique({
        where: { requestId },
        select: {
            status: true,
            user: {
                select: {
                    auth0Id: true,
                }
            }
        }
    });

    if (!hostRequest) {
        throw new AppError(404, "Host request not found");
    }

    if (hostRequest.status !== "PENDING") {
        throw new AppError(400, "Request already processed");
    }

    if(action == "APPROVE") {
        await assignHostRoleInAuth0(hostRequest.user.auth0Id);
    }

    const result = await prisma.$transaction(async (tx) => {
        const status =
            action === "APPROVE" ? "APPROVED" : "REJECTED";

        const updatedRequest = await tx.hostRequest.update({
            where: { requestId },
            data: {
                status,
                adminNotes,
                verifiedAt: new Date(),
                verifiedById: adminId,
            },
        });

        return {
            ...updatedRequest,
            userId: hostRequest.userId,
        };
    });

    return result;
};