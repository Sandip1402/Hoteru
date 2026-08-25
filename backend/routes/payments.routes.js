import express from 'express';

import { checkJwt, attachCurrentUser, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';

import {
    createPaymentOrderSchema,
    verifyPaymentSchema
} from '../validators/schema.validator.js';


export default function () {
    const router = express.Router();

    router.post(
        "/booking/:bookingId/order",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(createPaymentOrderSchema),
        createPaymentOrder
    );

    router.post(
        "/verify",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(verifyPaymentSchema),
        verifyPayment
    );

    return router;
}