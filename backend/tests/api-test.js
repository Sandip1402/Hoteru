import { checkJwt } from "../middlewares/auth.middleware.js";
import express from 'express'
const router = express.Router();

export default function () {
    router.get('/', checkJwt, (req, res) => {
        res.json({
            success: true,
            message: 'Hello from a private endpoint!',
            user: req.auth.payload.sub,
        });
    });
    return router;
}