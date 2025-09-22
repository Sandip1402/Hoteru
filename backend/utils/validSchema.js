const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(100),
        display_img: Joi.string().uri().allow("", null),
        images: Joi.array()
    }).required()
}).required();


const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().trim().required(),
        images: Joi.array(),
        privacy: Joi.string().valid("on").required()
    }).required()
}).required();


const userSchema = Joi.object({
    user: Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        TC: Joi.boolean().required()
    }).required()
}).required();

module.exports = {listingSchema, reviewSchema, userSchema};