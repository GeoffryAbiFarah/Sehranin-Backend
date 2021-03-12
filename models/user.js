const mongoose = require('mongoose');
const { use } = require('passport');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    name: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: "../public/images/default.jpeg"
    },
    email: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false,
        min: 16
    },
    phone: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);