const express = require('express');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const middlewares = require('./middlewares');

const router = express.Router();

const validations = [
  check('full_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A name is required'),
  check('reg_no')
    .not()
    .isEmpty()
    .escape()
    .withMessage('A valid registration number is required'),

  check('model')
    .not()
    .isEmpty()
    .escape()
    .withMessage('A valid model is required'),
];

module.exports = params => {
  const { vehicleService, avatars } = params;

  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const vehicles = await vehicleService.getVehicles();

      return res.render('layout', {
        title: 'Vehicles',
        template: 'vehicle/index',
        vehicles,
      });
    } catch (e) {
      return next(e);
    }
  });

  router.get('/new', middlewares.redirectIfNotAuthN, (req, res) => {
    const errors = req.session.vehicle ? req.session.vehicle.errors : false;
    const vehicleId = req.session.vehicle ? req.session.vehicle.vehicleId : false;
    req.session.vehicle = {};

    res.render('layout', {
      title: 'Add Vehicle',
      template: 'vehicle/new',
      errors,
      vehicleId,
    });
  });

  router.post(
    '/new',
    middlewares.redirectIfNotAuthN,
    middlewares.upload.single('avatar'),
    middlewares.handleAvatar(avatars),
    validations,
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.vehicle = { errors: errors.array() };
        return res.redirect('/vehicle/new');
      }

      try {
        if (req.file && req.file.storedFilename) {
          req.body.avatar = req.file.storedFilename;
        }

        const formData = req.body;
        const insertId = await vehicleService.addNewVehicle(formData);
        req.session.vehicle = { vehicleId: insertId };
        return res.redirect('/vehicle/new');
      } catch (error) {
        if (req.file && req.file.storedFilename) {
          await avatars.delete(req.file.storedFilename);
        }

        return next(error);
      }
    }
  );
  router.get('/edit/:vehicleId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const errors = req.session.vehicle ? req.session.vehicle.errors : false;
      req.session.employee = {};

      const result = await vehicleService.getVehicleById(req.params.vehicleId);

      return result
        ? res.render('layout', {
            title: result.full_name,
            // type: result.employee_type,
            template: 'vehicle/edit',
            errors,
            vehicle: result,
          })
        : next(createError(404, "That user doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });

  router.post(
    '/edit/:vehicleId',
    middlewares.redirectIfNotAuthN,
    middlewares.upload.single('avatar'),
    middlewares.handleAvatar(avatars),
    validations,
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.vehicle = { errors: errors.array() };
        return res.redirect(`/vehicle/edit/${req.params.vehicleId}`);
      }

      try {
        if (req.file && req.file.storedFilename) {
          req.body.avatar = req.file.storedFilename;
        }

        await vehicleService.updateVehicleById(req.params.vehicleId, req.body);
        return res.redirect(`/vehicle/`);
      } catch (error) {
        if (req.file && req.file.storedFilename) {
          await avatars.delete(req.file.storedFilename);
        }

        return next(error);
      }
    }
  );

  router.get('/details/:vehicleId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await vehicleService.getVehicleById(req.params.vehicleId);
      return result
        ? res.render('layout', {
            title: result.full_name,
            template: 'vehicle/detail',
            vehicle: result,
          })
        : next(createError(404, "That user doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.get('/avatar/:filename', middlewares.redirectIfNotAuthN, (req, res) => {
    res.type('png');
    return res.sendFile(avatars.filepath(req.params.filename));
  });

  router.get('/delete/:vehicleId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await vehicleService.getVehicleById(req.params.vehicleId);
      return result
        ? res.render('layout', {
            title: result.full_name,
            template: 'vehicle/delete',
            vehicle: result,
          })
        : next(createError(404, "That user doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/delete/:vehicleId', async (req, res, next) => {
    try {
      await vehicleService.deleteVehicleById(req.params.vehicleId, req.body);

      return res.redirect(`/vehicle`);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
