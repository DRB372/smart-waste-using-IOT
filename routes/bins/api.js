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

  router.get('/:binId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await binService.getBinById(req.params.binId);
      if (!result) {
        return res.status(404).json({ message: 'Unable find the bin.' });
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  });

  router.post(
    '/new',
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

  return router;
};
