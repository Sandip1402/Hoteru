import * as hostRequestService from "../services/host-request.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createHostRequest = asyncHandler(async (req, res) => {
    const request = await hostRequestService.createHostRequest(
        req.user.id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Request submitted successfully for verification.",
        data: request,
    });
});

export const getHostProfile = asyncHandler(async (req, res) => {
    const profile = await hostRequestService.getHostProfile(req.user.id);

    res.status(200).json({
        success: true,
        message: "Host profile retrieved successfully.",
        data: profile,
    });
});

export const getPendingHostRequests = asyncHandler(async (req, res, next) => {
    const requests = await hostRequestService.getPendingHostRequests();

    res.status(200).json({
        success: true,
        message: "Host requests retrieved successfully.",
        data: requests,
    })
})

export const processHostRequest = asyncHandler(async (req, res, next) => {
    const { action, adminNotes } = req.body;

    const result = await hostRequestService.processHostRequest(
        Number(req.params.requestId),
        req.user.id,
        action,
        adminNotes,
    );

    res.status(200).json({
        success: true,
        message: `Request ${action.toLowerCase()}d successfully.`,
        data: result,
    });
});