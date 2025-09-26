const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

module.exports = (app) => {
  app.delete("/api/listings/:id", wrapAsync(async (req, res) => {
      const { id } = req.params;
      const deletedListing = await Listing.findByIdAndDelete(id);
      if (!deletedListing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      res.status(204).json({
        success: true,
        message: "Listing deleted successfully",
      });
    })
  );
};
