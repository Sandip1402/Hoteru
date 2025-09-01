const validateData = require("../utils/middlewares/validateData.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

module.exports = (app) => {
    app.get("/home/new" ,(req, res) => {
            // Show the form
            res.render("pages/new.ejs");
        })

    app.post("/home", validateData, wrapAsync(async (req, res, next) => {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            res.redirect("/home");
        }));
}