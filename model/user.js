const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    confirmPassword: {
        type: String,
        required: true
    }
});

// To apply userSchema on user, use mongoose.model
const User = mongoose.model('User', userSchema);

module.exports = User;
