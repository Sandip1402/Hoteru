const {listingSchema, reviewSchema} = require("../schema.js");
const expressError = require("../expressError.js");

module.exports = (req, res, next) => {
    if (!req.body) {
        throw new expressError(400, "Request body is missing");
    }

    let schema;

    if (req.path.includes("/reviews")) {
        schema = reviewSchema;
    } else if (req.path === "/listings") {
        schema = listingSchema;
    }

    if (schema) {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errMsg = error.details.map(el => el.message).join(", ");
            throw new expressError(400, errMsg);
        }
    }

    next();
};