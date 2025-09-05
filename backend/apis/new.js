const validateData = require("../utils/middlewares/validateData.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

module.exports = (app) => {
    app.get("/api/home/new" ,(req, res) => {
            // Show the form
            res.status(200).json({
                success: true,
                message: "New listing form"
            })
        })

    app.post("/api/home", validateData, wrapAsync(async (req, res, next) => {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            if(!newListing){
                return res.status(400).json({
                    success: false,
                    message: "New listing failed"
                })
            }
            res.status(201).json({
                success: true,
                message: "New listing created"
            })
        }));
}