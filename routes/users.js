var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// User signup
router.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.name) {
          user.name = req.body.name;
        }
        if (req.body.image) {
          user.image = req.body.image;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.age) {
          user.age = req.body.age;
        }
        if (req.body.phone) {
          user.phone = req.body.phone;
        }
        if (req.body.description) {
          user.description = req.body.description;
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    });
});

// user by id
router.get('/id/:userId', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.params.userId)
      .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err));
});

router.put('/id/:userId', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
        if (user === null) {
            err = new Error('User ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
        }
        if (!(req.user._id.equals(req.params.userId))) {
            err = new Error('Operation not authorized!');
            err.status = 404;
            return next(err);
        }
        if (user != null) {
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.phone) {
                user.phone = req.body.phone;
            }
            user.save()
                .then((user) => {
                    Parties.findById(user._id)
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user);
                        })
                }, (err) => next(err));
        }

        else {
            err = new Error('User ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/id/:userId', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
        if (user === null) {
            err = new Error('user ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
        }
        if (!(req.user._id.equals(user._id))) {
            err = new Error('Operation not authorized!');
            err.status = 404;
            return next(err);
        }
        if (user != null) {
            user.remove();

            user.save()
                .then((user) => {
                    Parties.findById(user._id)
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user);
                        })
                }, (err) => next(err));
        }
        else {
            err = new Error('user ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfuly logged in!' });
});


module.exports = router;
