const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

module.exports = (app) => {
    // Delete Route
    app.delete("/home/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/home");
    }))
}