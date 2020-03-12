const express = require('express');
const createError = require('http-errors');
const { check, validationResult } = require('express-validator');
const middlewares = require('../middlewares');

const router = express.Router();

const validations = [
  check('bin_id')
    .trim()
    .not()
    .isEmpty()
    .escape()
    .withMessage('A valid bin ID is required'),
  check('latitude')
    .trim()
    .not()
    .isEmpty()
    .escape()
    .withMessage('A latitude is required'),
  check('longitude')
    .trim()
    .not()
    .isEmpty()
    .escape()
    .withMessage('A longitude is required'),
];

module.exports = params => {
  const { binService } = params;

  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const bins = await binService.getBins();

      return res.render('layout', {
        title: 'Bins',
        template: 'bins/index',
        bins,
      });
    } catch (e) {
      return next(e);
    }
  });

  router.post('/new', validations, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const formData = req.body;
    const result = await binService.addNewBin(formData);
    if (result.affectedRows !== 1) {
      return res.status(400).json({ message: 'Unable to add new bin.' });
    }
    return res.status(201).json({ message: 'New bin added successfully.' });
  });

  router.get('/details/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await binService.getBinById(req.params.binId);
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

  router.get('/delete/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await binService.getBinById(req.params.binId);
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
  router.post('/delete/:binId', async (req, res, next) => {
    try {
      await binService.deleteVehicleById(req.params.binId, req.body);

      return res.redirect(`/vehicle`);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
