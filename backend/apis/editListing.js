const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const validateData = require("../utils/middlewares/validateData.js");
const { listingSchema } = require("../utils/validSchema.js");

module.exports = (app) => {

    // get update request for listing
    app.get("/api/listings/:id/edit", wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }
        res.status(200).json({
            success:true,
            data: listing
        })
    }))

    // update listing
    app.put("/api/listings/:id", validateData(listingSchema), wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id,
            { ...req.body.listing },
            {new: true}
        );
        if (!listing) {
            return res.status(404).json({
                success: false,
                error: "Listing not found"
            });
        }
        res.status(200).json({
            success:true,
            data: listing
        })
    }))
}