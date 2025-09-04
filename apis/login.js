const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../config.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {access_Token, refresh_Token} = config;


module.exports = (app) => {
    // user login
    app.get('api/login', (req,res)=> {
        res.render("pages/login.ejs", {error : null});
    })
    app.post('/login', wrapAsync(async (req, res) => {
            const { email, pass } = req.body.user;
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.render("pages/login", { error: "No account found with this email." });
            }

            const passwordMatch = await bcrypt.compare(pass, user.password);
            if (!passwordMatch) {
                return res.render("pages/login", { error: "Password did not match. Please check your email and password." });
            }

            const accessToken = jwt.sign({ userId: user._id, role: "client" }, access_Token, { expiresIn: '1h', });
            const refreshToken = jwt.sign({ userId: user._id, role: "client" }, refresh_Token, { expiresIn: '1d' });
            
            localStorage.setItem('accessToken', accessToken);

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true })
                .headers('Authorization', `Bearer ${accessToken}`)
                .redirect("/home");
        }
    ));
}