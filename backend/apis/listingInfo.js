const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js")


module.exports = (app) => {
    app.get("/api/listings/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const listing = await Listing.findById(id).populate("reviews");
            if(!listing){
                return res.status(404).json({
                    success: false,
                    message: "Not found"
                })
            }
            res.status(200).json({
                success: true,
                data: listing
            })

        } else {
            return res.status(400).json({
                success: false,
                message: "Bad request"
            })
        }
    }))
}