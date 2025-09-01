const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const validateData = require("../utils/middlewares/validateData.js");

module.exports = (app) => {
    // user registration
    app.get('/signup', (req,res) => {
        res.render("pages/signup.ejs");
    })
    app.post('/signup', validateData, wrapAsync(async(req, res) => {
        const {password, TC, ...userDetail} = req.body.user;
        TC = TC === "on";
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({TC, password: hashedPassword, ...userDetail });
        await user.save();
        console.log("User registered successfully");
        res.redirect("/login");
    }))
}