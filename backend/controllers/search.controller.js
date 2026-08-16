import { asyncHandler } from "../utils/async-handler.js"
import * as searchService from "../services/search.service.js"

export const searchListings = asyncHandler(async (req, res) => {
    const {
        listings,
        // filters,
        pagination
    } = await searchService.searchListings(req.validatedQuery);

    res.status(200).json({
        success: true,
        data: listings,
        // filters,
        pagination,
    });
});

export const getSearchSuggestions = asyncHandler(async (req, res) => {
    const suggestions =
        await searchService.getSearchSuggestions(
            req.validatedQuery.destination
        );

    res.status(200).json({
        success: true,
        data: suggestions,
    });
});