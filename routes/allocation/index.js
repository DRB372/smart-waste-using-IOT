const express = require('express');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const middlewares = require('../middlewares');
const utils = require('../../lib/utils');

const router = express.Router();


module.exports = params => {
  const { employeeService } = params;
  const { trackService } = params;
  const {allocationService} = params;
  const {vehicleService} = params;
  const { binService } = params;
  
  router.get('/employeeTrack', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const drivers = await employeeService.getDrivers();
      const tracks = await trackService.getTracks();
      return res.render('layout', {
        title: 'Allocation',
        template: 'allocation/employeeTrack',
        drivers,
        tracks,
       });
    } catch (e) {
      return next(e);
    }
  });
  
  router.post(
    '/employeeTrack',
    middlewares.redirectIfNotAuthN,

    async (req, res, next) => {
      try {
        const formData = req.body;
        const insertId = await employeeService.assignTrack(formData);
        return res.redirect('/allocation/employeeTrack');
      } catch (error) {

        return next(error);
      }
    }
  );
  router.get('/employeeTrack/delete/:employee_track_id', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await allocationService.getTrackById(req.params.employee_track_id);
     
      return result
        ? res.render('layout', {
            title: "Delete",
            template: 'allocation/employeeTrackDelete',
            result,
          })
        : next(createError(404, "That Track doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/employeeTrack/delete/:employee_track_id', async (req, res, next) => {
    try {
     
      await allocationService.deleteTrackById(req.params.employee_track_id, req.body);

      return res.redirect(`/employee`);
    } catch (error) {
      return next(error);
    }
  });

  //Assign Vehicle to Employee
  router.get('/employeeVehicle', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const drivers = await employeeService.getDrivers();
      const vehicles = await vehicleService.getVehicles();
      return res.render('layout', {
        title: 'Allocation',
        template: 'allocation/employeeVehicle',
        drivers,
        vehicles,
       });
    } catch (e) {
      return next(e);
    }
  });

  router.post(
    '/employeeVehicle',
    middlewares.redirectIfNotAuthN,

    async (req, res, next) => {
      try {
        const formData = req.body;
       
        const insertId = await employeeService.assignVehicle(formData);
        return res.redirect('/allocation/employeeVehicle');
      } catch (error) {

        return next(error);
      }
    }
  );

  router.get('/employeeVehicle/delete/:employee_vehicle_id', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await allocationService.getVehicleById(req.params.employee_vehicle_id);
     
      return result
        ? res.render('layout', {
            title: "Delete",
            template: 'allocation/employeeVehicleDelete',
            result,
          })
        : next(createError(404, "That allocation doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/employeeVehicle/delete/:employee_vehicle_id', async (req, res, next) => {
    try {
     
      await allocationService.deleteVehicleById(req.params.employee_vehicle_id, req.body);

      return res.redirect(`/employee`);
    } catch (error) {
      return next(error);
    }
  });

//Assign Bins To Tracks 
 
  router.get('/trackBin', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
     
      const tracks = await trackService.getTracks();
      const bins = await binService.getBins();
     
      return res.render('layout', {
        title: 'Allocation',
        template: 'allocation/trackBin',
        bins,
        tracks,
       });
    } catch (e) {
      return next(e);
    }
  });

  router.post(
    '/trackBin',
    middlewares.redirectIfNotAuthN,

    async (req, res, next) => {
      try {
        const formData = req.body;
       
        const insertId = await trackService.assignBin(formData);
        return res.redirect('/allocation/trackBin');
      } catch (error) {

        return next(error);
      }
    }
  );

  router.get('/trackBin/delete/:track_bin_id', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await allocationService.getBinById(req.params.track_bin_id);
     
      return result
        ? res.render('layout', {
            title: "Delete",
            template: 'allocation/trackBinDelete',
            result,
          })
        : next(createError(404, "That allocation doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/trackBin/delete/:track_bin_id', async (req, res, next) => {
    try {
     
      await allocationService.deleteBinById(req.params.track_bin_id, req.body);

      return res.redirect(`/track`);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
