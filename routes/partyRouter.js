const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Parties = require('../models/party');
const authenticate = require('../authenticate');
const cors = require('./cors');
const partyRouter = express.Router();

partyRouter.use(bodyParser.json());

//============================================Router for /parties=================================================
partyRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors, (req, res, next) => {
        Parties.find()
            // .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        req.body.author = req.user._id;

        //console.log("DATAAAAAAAAAAAAAAAAAA", req.files.data);

        // if (req.files.image) {
        //     const myImage = req.files.image;
        //     myImage.mv(`../public/images/${myImage.name}`, function (err) {
        //         if (err) {
        //             console.log(err)
        //             return res.status(500).send({ msg: "Error occured" });
        //         }
        //         // returing the response with file path and name
        //         return res.send({ name: myFile.name, path: `/${myImage.name}` });
        //     });
        // }

        Parties.create(req.body)
            
            .then((party) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(party);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Update operation not supported for /parties.");
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Parties.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/partyId===================================================
partyRouter.route('/id/:partyId')
    .get(cors.cors,(req, res, next) => {
        Parties.findById(req.params.partyId)
            .populate('party.author')
            .then((party) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(party);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported for /parties/' + req.params.partyId + '.')
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Parties.findById(req.params.partyId)
            .then((party) => {
                if (party === null) {
                    err = new Error('Party ' + req.params.partyId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                if (!(req.user._id.equals(party.author))) {
                    err = new Error('Operation not authorized!');
                    err.status = 404;
                    return next(err);
                }
                if (party != null) {
                    if (req.body.description) {
                        party.description = req.body.description;
                    }
                    if (req.body.image) {
                        party.image = req.body.image;
                    }
                    if (req.body.date) {
                        party.date = req.body.date;
                    }
                    party.save()
                        .then((party) => {
                            Parties.findById(party._id)
                                .populate('party.author')
                                .then((party) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(party);
                                })
                        }, (err) => next(err));
                }

                else {
                    err = new Error('Party ' + req.params.partyId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Parties.findById(req.params.partyId)
            .then((party) => {
                if (party === null) {
                    err = new Error('Party ' + req.params.partyId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                if (!(req.user._id.equals(party.author))) {
                    err = new Error('Operation not authorized!');
                    err.status = 404;
                    return next(err);
                }
                if (party != null) {
                    party.remove();

                    party.save()
                        .then((party) => {
                            Parties.findById(party._id)
                                .populate('party.author')
                                .then((party) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(party);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Party ' + req.params.partyId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//======================================================================================================================
// SEARCH : The user should be able to search by place, address, and date.
//======================================================================================================================

//========================================Router for /parties/place===================================================
partyRouter.route('/place/:place')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors,(req, res, next) => {
        Parties.find({ place: req.params.place })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/address===================================================
partyRouter.route('/address/:address')
    .get(cors.cors,(req, res, next) => {
        Parties.find({ address: req.params.address })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/date===================================================
partyRouter.route('/date/:date')
    .get(cors.cors,(req, res, next) => {
        Parties.find({ date: req.params.date })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/placeAndAddress===================================================
partyRouter.route('/placeAndAddress/:place/:address')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors,(req, res, next) => {
        Parties.find({ place: req.params.place, address: req.params.address })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/placeAndDate===================================================
partyRouter.route('/placeAndDate/:place/:date')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors,(req, res, next) => {
        Parties.find({ place: req.params.place, date: req.params.date })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/addressAndDate===================================================
partyRouter.route('/addressAndDate/:address/:date')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors,(req, res, next) => {
        Parties.find({ address: req.params.address, date: req.params.date })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//========================================Router for /parties/placeAddressAndDate===================================================
partyRouter.route('/placeAddressAndDate/:place/:address/:date')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.cors,(req, res, next) => {
        Parties.find({ place: req.params.place, address: req.params.address, date: req.params.date })
            .populate('party.author')
            .then((parties) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(parties);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = partyRouter;