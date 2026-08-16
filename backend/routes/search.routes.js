import express from 'express';

import {
    searchListingsSchema,
    searchSuggestionsSchema
} from "../validators/schema.validator.js";

import {
    searchListings,
    getSearchSuggestions
} from "../controllers/search.controller.js";

import { validate } from "../middlewares/validate.middleware.js";


export default function () {
    const router = express.Router();
    
    // Public
    router.get(
        "/listings",
        validate(searchListingsSchema, "query"),
        searchListings
    );

    router.get(
        "/suggestions",
        validate(searchSuggestionsSchema, "query"),
        getSearchSuggestions
    );

    return router;
}