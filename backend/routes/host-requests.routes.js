import express from 'express'

import {
    createHostRequest,
    getHostProfile,
    getPendingHostRequests,
    processHostRequest
} from '../controllers/host-request.controller.js';

import {
    attachCurrentUser,
    checkJwt,
    requireRole,
} from '../middlewares/auth.middleware.js'
import { validate } from "../middlewares/validate.middleware.js";

import {
    createHostRequestSchema,
    reviewHostRequestSchema,
} from '../validators/schema.validator.js';

export default function () {
    const router = express.Router();

    // api for users to request account upgrade to host
    router.post("/",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(createHostRequestSchema),
        createHostRequest
    );

    router.get(
        "/profile",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        getHostProfile
    );

    // V2 : include endpoints to view all the host requests and eventually
    // a filter to choose between, all, pending, rejected, approved for admin

    // Admin views pending requests
    router.get(
        "/pending",
        checkJwt,
        attachCurrentUser,
        requireRole("admin"),
        getPendingHostRequests
    );

    // api for admins to accept or reject host upgradation request
    router.patch(
        "/:requestId",
        checkJwt,
        attachCurrentUser,
        requireRole("admin"),
        validate(reviewHostRequestSchema),
        processHostRequest
    );

    return router;
};