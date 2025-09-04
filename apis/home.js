const Listing = require("../models/listing.js");
const authUser = require("../utils/middlewares/authUser.js");
const wrapAsync = require("../utils/wrapAsync.js");


module.exports = (app) => {
    app.get(["/", "/home"], authUser, wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("pages/home.ejs", { allListings });
    }))
}