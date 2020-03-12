const express = require('express');
const passport = require('passport');
const middlewares = require('../middlewares');

const router = express.Router();

module.exports = () => {
  router.get('/login', middlewares.redirectIfAuthN, (req, res) =>
    res.render('login', { error: req.query.error })
  );

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login?error=true',
    })
  );

  router.get('/logout', middlewares.redirectIfNotAuthN, (req, res) => {
    req.logout();
    return res.redirect('/auth/login');
  });

  return router;
};
