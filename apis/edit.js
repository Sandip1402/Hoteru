const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const validateData = require("../utils/middlewares/validateData.js");

module.exports = (app) => {
    // update listing route
    app.get("/home/:id/edit", wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("pages/edit.ejs", { listing });
    }))
    // update listing
    app.put("/listings/:id", validateData, wrapAsync(async (req, res) => {
        // if(!req.body.listing){
        //     throw new expressError(400, "Send valid data for listing");
        // }
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/home");
    }))
}