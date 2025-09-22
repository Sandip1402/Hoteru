const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const validateData = require("../utils/middlewares/validateData.js");
const { userSchema } = require("../utils/validSchema.js");

module.exports = (app) => {
    app.post('/api/signup', validateData(userSchema), wrapAsync(async (req, res) => {
        const { password, ...userDetail } = req.body.user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ password: hashedPassword, ...userDetail });
        try {
            await newUser.save();
            console.log(newUser);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: { id: newUser._id, email: newUser.email }
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists. Please try logging in."
                });
            } else {
                console.error("Signup error: ", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to sign up"
                });
            }
        }
    }))
}