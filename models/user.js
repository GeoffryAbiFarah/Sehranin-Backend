const mongoose = require('mongoose');
const { use } = require('passport');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: false
    },
    phone: {
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