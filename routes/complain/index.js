const express = require('express');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const middlewares = require('../middlewares');

const router = express.Router();


module.exports = params => {
  const { complainService } = params;

  router.get('/', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
      const complains = await complainService.getComplains();

      return res.render('layout', {
        title: 'Complains',
        template: 'complain/index',
        complains,
      });
    } catch (e) {
      return next(e);
    }
  });
  router.get('/:complainId', middlewares.redirectIfNotAuthN, async (req, res, next) => {
    try {
    
      const result = await complainService.getComplainById(req.params.complainId);
     
      return result
        ? res.render('layout', {
            title: result.name,
            template: 'complain/delete',
            complains: result,
          })
        : next(createError(404, "This Complain doesn't exist"));
    } catch (e) {
      return next(e);
    }
  });
  router.post('/:complainId', async (req, res, next) => {
    try {
      await complainService.deleteComplainById(req.params.complainId, req.body);

      return res.redirect(`/complain`);
    } catch (error) {
      return next(error);
    }
  });


  
  return router;
};
