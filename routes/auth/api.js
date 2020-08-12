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
        if(user.employee_type === 'driver'){
          // console.log(user);
        const token = jwt.sign({ id: user.email}, process.env.JWT_SECRET, { expiresIn: 380000 });
        return res.status(201).json({ message: 'Login Successfully', id:user.employee_id, name:user.full_name,success: true, token });}
        else{
        return res.status(400).json({ message: 'Username or password is incorrect' });

        }
      });
    })(req, res, next);
  });

  return router;
};
