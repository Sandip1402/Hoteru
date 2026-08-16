import { prisma } from "../lib/prisma.js";
import express from "express";

export default function () {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const users = await prisma.user.count();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message,
                code: error.code,
                stack: error.stack,
            });
        }
    });

    return router;
}