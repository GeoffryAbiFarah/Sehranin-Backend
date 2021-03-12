const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const partySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    place: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    //date of the party, format:
    date: {
        type: String,
        required: true
    },
    //doors open at : X
    open: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    drinks: {
        type: Boolean,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Parties = mongoose.model('Party', partySchema);

module.exports = Parties;