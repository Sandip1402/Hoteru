const validateData = require("../utils/middlewares/validateData.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../utils/validSchema.js");

module.exports = (app) => {
    app.post("/api/listings/new", validateData(listingSchema), wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        if(!newListing){
            return res.status(400).json({
                success: false,
                message: "New listing failed"
            })
        }
        console.log("New listing saved");
        res.status(201).json({
            success: true,
            message: "New listing created"
        })
    }));
}