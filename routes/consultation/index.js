const express = require('express');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const middlewares = require('../middlewares');

const router = express.Router();


module.exports = params => {
  const { consultationService } = params;

  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const consults = await consultationService.getConsultation();

      return res.render('layout', {
        title: 'consultation',
        template: 'consultation/index',
        consults,
      });
    } catch (e) {
      return next(e);
    }
  });
  router.get('/resolve/:consultId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
    
      const result = await consultationService.getConsultationById(req.params.consultId);
     
      return result
        ? res.render('layout', {
            title: result.name,
            template: 'consultation/delete',
            consults: result,
          })
        : next(createError(404, "This Consultation doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/resolve/:consultId', async (req, res, next) => {
    try {
      await consultationService.deleteConsultationById(req.params.consultId, req.body);

      return res.redirect(`/consultation`);
    } catch (error) {
      return next(error);
    }
  });


  
  return router;
};
