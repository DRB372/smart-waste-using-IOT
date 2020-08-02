const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const utils = require('./utils');
const { session } = require('passport');
const { compareSync } = require('bcrypt');
require('dotenv').config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports.passportConfig = params => {
  const { employeeService } = params;

  passport.use(
    
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await employeeService.getEmployeeByEmail(username);
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        const passwordOK = await utils.comparePassword(password, user.passwrd);
        if (!passwordOK) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'jwt',
    new JWTStrategy(opts, async (jwtPayload, done) => {
      const user = await employeeService.getEmployeeByEmail(jwtPayload.id);
      if (!user) {
        return done(null, false, { message: 'Invalid token' });
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user.employee_id));
  passport.deserializeUser(async (uid, done) => {
    try {
      const user = await employeeService.getEmployeeById(uid);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  return {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
      res.locals.user = req.user;
      return next();
    },
  };
};
