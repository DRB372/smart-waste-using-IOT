const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

module.exports = () => {
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({ message: 'Username or password is incorrect' });
      }
      req.login(user, { session: false }, _err => {
        if (_err) {
          res.send(_err);
        }
        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, { expiresIn: 3600 });
        return res.json({ success: true, token });
      });
    })(req, res, next);
  });

  return router;
};
