const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports = (app) => {
    app.get(["/", "/home"], wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("pages/home.ejs", { allListings });
    }))
}