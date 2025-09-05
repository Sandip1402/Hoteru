const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const validateData = require("../utils/middlewares/validateData.js");
const config = require("../config.js");

const {access_Token, refresh_Token} = config;

module.exports = (app) => {
    // user registration
    app.get('/api/signup', (req,res) => {
        res.status(200).json({
            success: true
        })
    })
    app.post('/api/signup', validateData, wrapAsync(async(req, res) => {
        const {password, check, ...userDetail} = req.body.user;
        const TC = check === "on";
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({TC, password: hashedPassword, ...userDetail });

        try {
            await user.save();

            // ---- Generating tokens ----
            const payload = { userId: user._id, role: "client" };
            const accessToken = jwt.sign(payload, access_Token, { expiresIn: "1h" });
            const refreshToken = jwt.sign(payload, refresh_Token, { expiresIn: "4d" });

            // ---- refreshToken in httpOnly cookie ----
            res.cookie("refreshToken", refreshToken, {
            httpOnly: true,     
            secure: true,       
            sameSite: "strict", 
            });

            // ---- sending accessToken + user info with response ----
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: { id: user._id, email: user.email, username: user.firstname },
                accessToken: accessToken
            });

        } catch (err) {
            if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "Email already in use"
            });
            }
            throw err;
        }
    }))
}