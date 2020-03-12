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
  check('bin_address')
    .trim()
    .escape(),
  check('remarks')
    .trim()
    .escape(),
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

  router.get('/details/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await binService.getBinById(req.params.binId);
      return result
        ? res.render('layout', {
            title: `Bin ${result.bin_id}`,
            template: 'bins/detail',
            bins: result,
          })
        : next(createError(404, "That Bin doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });

  router.get('/delete/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await binService.getBinById(req.params.binId);
      return result
        ? res.render('layout', {
            title: `Bin ${result.bin_id}`,
            template: 'bins/delete',
            bins: result,
          })
        : next(createError(404, "That user doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });

  router.post('/delete/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      await binService.deleteBinById(req.params.binId, req.body);

      return res.redirect(`/bins`);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/edit/:binId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const errors = req.session.bin ? req.session.bin.errors : false;
      req.session.bin = {};

      const result = await binService.getBinById(req.params.binId);

      return result
        ? res.render('layout', {
            title: `Bin ${result.bin_id}`,
            template: 'bins/edit',
            errors,
            bins: result,
          })
        : next(createError(404, "That bin doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });

  router.post(
    '/edit/:binId',
    middlewares.redirectIfNotAuthN,
    validations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.bin = { errors: errors.array() };
        return res.redirect(`/bins/edit/${req.params.binId}`);
      }
      try {
        await binService.updateBinById(req.params.binId, req.body);
        return res.redirect(`/bins`);
      } catch (error) {
        return next(error);
      }
    }
  );

  return router;
};
