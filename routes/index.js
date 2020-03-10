const express = require('express');
const passport = require('passport');
const employeeRoute = require('./employee');
const vehicleRoute = require('./vehicle');
const middlewares = require('./middlewares');

const router = express.Router();

module.exports = params => {
  router.get('/', middlewares.redirectIfNotAuthN, (req, res) => {
    res.render('layout', { title: 'Dashboard', template: 'index' });
  });

  router.get('/login', middlewares.redirectIfAuthN, (req, res) =>
    res.render('login', { error: req.query.error })
  );

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login?error=true',
    })
  );

  router.get('/logout', middlewares.redirectIfNotAuthN, (req, res) => {
    req.logout();
    return res.redirect('/login');
  });

  router.use('/employee', employeeRoute(params));
  router.use('/vehicle', vehicleRoute(params));

  return router;
};
