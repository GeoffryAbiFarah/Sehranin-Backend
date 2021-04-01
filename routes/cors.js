const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3001']

var corsOptionsDelegate = (req, callback) => {
    var ccorsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        ccorsOptions = { origin: true };
    }
    else {
        ccorsOptions = { origin: false };
    }
    callback(null, ccorsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);