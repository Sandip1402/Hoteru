const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        unique: true, 
        required: true 
    },
    lastname: {
        type: String,
        unique: true, 
        required: true 
    },
    email: {
        type: String,
        unique: true, 
        required: true   
    },
    password: { 
        type: String, 
        required: true 
    },
    TC: {
        type: Boolean,
        required: true
    },
    Joined_on: {
        type: Date,
        required: true,
        default: new Date()
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;