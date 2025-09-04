const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");

module.exports = (app) => {
    app.get("/home/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const listing = await Listing.findById(id).populate("reviews");
            res.render("pages/show.ejs", { listing });
        } else {
            throw new expressError(404, "Page Not found");
        }
    }))
}