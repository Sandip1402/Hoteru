const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../config.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {access_Token, refresh_Token} = config;

module.exports = (app) => {
    app.post('/api/login', wrapAsync(async (req, res) => {
            const { email, password } = req.body.user;
            const user = await User.findOne({ email: email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }
            const payload = { userId: user._id, role: "client" };
            const accessToken = jwt.sign(payload, access_Token, { expiresIn: '1h', });
            const refreshToken = jwt.sign(payload, refresh_Token, { expiresIn: '4d' });

            console.log(`${user.email} logged in`);

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true })
                .set('Authorization', `Bearer ${accessToken}`)
                .status(200)
                .json({
                    success: true,
                    accessToken,
                    message: "Logged in successfully"
            })
        }
    ));
}