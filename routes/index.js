const express = require('express');
const authRoute = require('./auth');
const employeeRoute = require('./employee');
const vehicleRoute = require('./vehicle');
const binRoute = require('./bins');
const binApiRoute = require('./bins/api');
const middlewares = require('./middlewares');

const router = express.Router();

module.exports = params => {
  router.get('/', middlewares.redirectIfNotAuthN, (req, res) => {
    res.render('layout', { title: 'Dashboard', template: 'index' });
  });

  router.use('/auth', authRoute());
  router.use('/employee', employeeRoute(params));
  router.use('/vehicle', vehicleRoute(params));
  router.use('/bins', binRoute(params));
  router.use('/api/bins', binApiRoute(params));

  return router;
};
