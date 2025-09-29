const wrapAsync = require("../utils/wrapAsync")
const User = require("../models/user.js");
const auth = require("../utils/middlewares/auth.js");


module.exports = (app) => {
    app.get("/api/user/:userId", auth, wrapAsync(async (req, res) => {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            data: user
        })
    }))

    app.put("/api/user/:userId", auth, wrapAsync(async (req, res) => {
        const { userId } = req.params;

        const updatedUser = req.body.user;
        const resExistingUser = await fetch(`/api/user/${userId}`);

        if (resExistingUser.status === 404) {
            return resExistingUser;
        }

        const userData = await resExistingUser.json();
        let existingUser = userData.data;
        const user = await User.findByIdAndUpdate(userId,
            { ...existingUser, ...updatedUser },
            { new: true }
        );
        if (!user) {
            return res.status(408).json({
                success: false,
                message: "Updation failed"
            })
        }
        res.status(200).json({
            success: true,
            message: "Updated successfully"
        })
    }))

    app.delete("/api/user/:userId", wrapAsync(async (req, res) => {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(204).json({
            success: true,
            message: "User deleted successfully",
        });
    }))
}