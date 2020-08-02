const express = require('express');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const middlewares = require('../middlewares');

const router = express.Router();

const validations = [
  check('track_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A name is required'),
  
];

module.exports = params => {
  const { trackService } = params;

  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const tracks = await trackService.getTracks();

      return res.render('layout', {
        title: 'Tracks',
        template: 'track/index',
        tracks,
      });
    } catch (e) {
      return next(e);
    }
  });

  router.get('/new', middlewares.redirectIfNotAuthN, (req, res) => {
    const errors = req.session.track ? req.session.track.errors : false;
    const trackId = req.session.track ? req.session.track.trackId : false;
    req.session.track = {};

    res.render('layout', {
      title: 'Add track',
      template: 'track/new',
      errors,
      trackId,
    });
  });

  router.post(
    '/new',
    middlewares.redirectIfNotAuthN,
    validations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        req.session.track = { errors: errors.array() };
        return res.redirect('/track/new');
      }
      try {
        console.log('DRB');
        const formData = req.body;
        console.log(formData);
        const insertId = await trackService.addNewTrack(formData);
        req.session.track = { trackId: insertId };
        return res.redirect('/track/new');
      } catch (error) {

        return next(error);
      }
    }
  );

  router.get('/edit/:trackId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const errors = req.session.track ? req.session.track.errors : false;
      

      const result = await trackService.getTrackById(req.params.trackId);

      return result
        ? res.render('layout', {
            title: result.track_name,
            // type: result.employee_type,
            template: 'track/edit',
            errors,
            track: result,
          })
        : next(createError(404, "That Track doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });

  router.post(
    '/edit/:trackId',
    middlewares.redirectIfNotAuthN,
    validations,
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.track = { errors: errors.array() };
        return res.redirect(`/track/edit/${req.params.trackId}`);
      }

      try {
        
        await trackService.updateTrackById(req.params.trackId, req.body);
        return res.redirect(`/track/`);
      } catch (error) {
        
        return next(error);
      }
    }
  );

  router.get('/details/:trackId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await trackService.getTrackById(req.params.trackId);
     const bins = await trackService.getBinsByTrackId(req.params.trackId);
      return result
        ? res.render('layout', {
            title: result.track_name,
            template: 'track/detail',
            track: result,
            bins,
          })
        : next(createError(404, "That Track doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  
  router.get('/delete/:trackId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const result = await trackService.getTrackById(req.params.trackId);
     
      return result
        ? res.render('layout', {
            title: result.track_name,
            template: 'track/delete',
            track: result,
          })
        : next(createError(404, "That Track doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/delete/:trackId', async (req, res, next) => {
    try {
      await trackService.deleteTrackById(req.params.trackId, req.body);

      return res.redirect(`/track`);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
