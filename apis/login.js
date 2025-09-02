const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../config.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {access_Token, refresh_Token} = config;

module.exports = (app) => {
    // user login
    app.get('/login', (req,res)=> {
        res.render("pages/login.ejs");
    })
    app.post('/login', wrapAsync(async (req, res) => {
            const { email, pass } = req.body.user;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = await bcrypt.compare(pass, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }

            const accesstoken = jwt.sign({ userId: user._id, role: "client" }, access_Token, { expiresIn: '1h', });
            const refreshToken = jwt.sign({ userId: user._id, role: "client" }, refresh_Token, { expiresIn: '1d' });

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true })
                .header('Authorization', `Bearer ${accesstoken}`)
                .redirect("/home");
        }
    ));
}