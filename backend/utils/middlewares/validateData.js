const expressError = require("../expressError.js");

module.exports = (schema) => {
    return (req, res, next) => {
        // console.log("Validating:", req.path);
        // console.dir(req.body);

        if (!req.body) {
            throw new expressError(400, "Request body is missing");
        }

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errMsg = error.details.map(el => el.message).join(", ");
            throw new expressError(400, errMsg);
        }

        next();
    }
};