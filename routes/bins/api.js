const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

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
  const { employeeService } = params;
  const { trackService } = params;

  router.get(
    '/tracks/:employeeId',
    passport.authenticate('jwt', { session: false }),

    async (req, res) => {
      // console.log(hello);
      try {
        const result = await employeeService.getTracksByEmployeeId(req.params.employeeId);
        if (!result) {
          return res.status(404).json({ message: 'Unable find the tracks.' });
        }
        return res.json(result);
      } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
      }
    }
  );

  router.get(
    '/bins/:trackId',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const result = await trackService.getBinsByTrackId(req.params.trackId);
        if (!result) {
          return res.status(404).json({ message: 'Unable find the Bins.' });
        }
        return res.json({results:result});
      } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
      }
    }
  );

  router.get(
    '/bin/:binId',
     passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const result = await binService.getBinById(req.params.binId);
        if (!result) {
          return res.status(404).json({ message: 'Unable find the Bins.' });
        }
        return res.json(result);
      } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
      }
    }
  );

  router.post(
    '/bins/new',
     passport.authenticate('jwt', { session: false }),
    validations,
    async (req, res) => {
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
    }
  );

  router.get(
    '/bins',
    // passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const result = await binService.getBins();
        if (!result) {
          return res.status(404).json({ message: 'Unable find the Bins.' });
        }
        return res.json({results:result});
      } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
      }
    }
  );
  router.post(
    '/binlevel/new',
    //  passport.authenticate('jwt', { session: false }),
    
    async (req, res) => {
            const formData = req.body;
            // console.log(formData);
      const result = await binService.addLevelBin(formData);
      if (result.affectedRows !== 1) {
        return res.status(400).json({ message: 'Unable to add new bin.' });
      }
      return res.status(201).json({ message: 'New bin added successfully.' });
    }
  );

 
 
  return router;
};
