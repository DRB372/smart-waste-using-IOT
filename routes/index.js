const express = require('express');
const authRoute = require('./auth');
const authApiRoute = require('./auth/api');
const employeeRoute = require('./employee');
const vehicleRoute = require('./vehicle');
const binRoute = require('./bins');
const binApiRoute = require('./bins/api');
const middlewares = require('./middlewares');

const router = express.Router();

module.exports = params => {
  const { binService, indexService } = params;
  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const bins = await binService.getBins();
      const vehicleCount = await indexService.getVehicleCount();
      const binsCount = await indexService.getBinsCount();
      const employeeCount = await indexService.getEmployeeCount();
      return res.render('layout', {
        title: 'Dashboard',
        template: 'index',
        employeeCount,
        binsCount,
        vehicleCount,
        bins,
      });
    } catch (e) {
      return next(e);
    }
  });

  router.use('/auth', authRoute());
  router.use('/api/auth', authApiRoute());
  router.use('/employee', employeeRoute(params));
  router.use('/vehicle', vehicleRoute(params));
  router.use('/bins', binRoute(params));
  router.use('/api/bins', binApiRoute(params));

  return router;
};
