
module.exports = (app) => {
    app.post("/logout", (req, res) => {
        res.clearCookie("refreshToken");
        res.send({ success: true });
    })
}