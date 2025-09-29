const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    const { userId } = req.params;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }

        req.user = decoded; // { id: .., role: ..}

        if (userId && userId !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        next();
    });
}
