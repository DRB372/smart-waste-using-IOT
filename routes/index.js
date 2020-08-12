const express = require('express');
const authRoute = require('./auth');
const authApiRoute = require('./auth/api');
const employeeRoute = require('./employee');
const vehicleRoute = require('./vehicle');
const trackRoute = require('./track');
const binRoute = require('./bins');
const consultRoute = require('./consultation')
const complainRoute = require('./complain')

const allocatinRoute = require('./allocation')
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
      const trackCount = await indexService.getTrackCount();
      return res.render('layout', {
        title: 'Dashboard',
        template: 'index',
        employeeCount,
        binsCount,
        trackCount,
        vehicleCount,
        bins,
      });
    } catch (e) {
      return next(e);
    }
  });
  router.get('/about', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
     
      return res.render('layout', {
        title: 'About Us',
        template: 'about/index',
      });
    } catch (e) {
      return next(e);
    }
  });
 
  router.use('/auth', authRoute());
  router.use('/api/auth', authApiRoute());
  router.use('/employee', employeeRoute(params));
  router.use('/vehicle', vehicleRoute(params));
  router.use('/track', trackRoute(params));
  router.use('/bins', binRoute(params));
  router.use('/allocation',  allocatinRoute(params));
  router.use('/consultation',  consultRoute(params));
  router.use('/api', binApiRoute(params));
  router.use('/complain', complainRoute(params));


  return router;
};
