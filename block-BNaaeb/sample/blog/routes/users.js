var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', (req, res, next) => {
  console.log();
  res.render('register', { error: req.flash('error')[0] });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.name === 'MongoError') {
        req.flash('error', 'This email is taken');
        return res.redirect('/users/register');
      }
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
      return res.json({ err });
    }

    res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'email/password required');
    res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(user);
    if (err) return next(err);
    // no user
    if (!user) {
      req.flash('error', 'register user before attempting login');
      res.redirect('users/login');
    }
    // user exists - compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password verification failed');
        res.redirect('/users/login');
      }
      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  // res.clearCookie('connect.sid');
  res.redirect('/');
});
module.exports = router;