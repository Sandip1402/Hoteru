const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(100),
        image: Joi.string().uri().allow("", null),
    }).required()
}).required();


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().trim().required(),
    }).required()
}).required();


module.exports.userSchema = Joi.object({
    user: Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        TC: Joi.boolean().truthy("on").falsy("off").required(),
    }).required()
}).required();