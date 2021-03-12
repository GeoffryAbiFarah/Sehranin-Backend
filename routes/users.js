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

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfuly logged in!' });
});

// User logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.statusCode = 403;
    next(err);
  }
});

module.exports = router;
