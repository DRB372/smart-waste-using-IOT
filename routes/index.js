const express = require('express');

const employeeRoute = require('./employee');

const router = express.Router();

module.exports = params => {
  router.get('/', (req, res) => {
    res.render('layout', { title: 'Dashboard', template: 'index' });
  });
  
  router.use('/employee', employeeRoute(params));

  return router;
};