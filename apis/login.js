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
            const { email, password } = req.body.user;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const token = jwt.sign({ userId: user._id }, access_Token, { expiresIn: '1h', });
            const refreshToken = jwt.sign({ user }, refresh_Token, { expiresIn: '1d' });

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', access_Token)
                .send(user);
            res.status(200).json({ token });
        }
    ));
}