const Listing = require("../models/listing.js");
const authUser = require("../utils/middlewares/authUser.js");
const wrapAsync = require("../utils/wrapAsync.js");


module.exports = (app) => {
    app.get(["/", "/api/home"], authUser, wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        if(!allListings){
            return res.status(404).json({
                success: false,
                message: "No data found"
            })
        }
        res.status(200).json({
            success: true,
            data: allListings
        })
    }))
}