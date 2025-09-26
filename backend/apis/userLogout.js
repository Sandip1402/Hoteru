
module.exports = (app) => {
    app.post("/api/logout", (req, res) => {
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: true})
            .status(200).json({ success: true, message: "Logged out successfully" });
    });
}