
module.exports = (app) => {
    app.post("/logout", (req, res) => {
        localStorage.removeItem("accessToken");
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })
        res.json({ success: true, message: "Logged out successfully" });
    });
}