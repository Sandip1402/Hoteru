const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");

module.exports = (app) => {
    app.get("/api/home/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const listing = await Listing.findById(id).populate("reviews");
            if(!listing){
                return res.status(404).json({
                    success: true,
                    message: "Not found"
                })
            }
            res.status(200).json({
                success: true,
                message: listing
            })

        } else {
            return res.status(400).json({
                success: true,
                message: "Bad request"
            })
        }
    }))
}