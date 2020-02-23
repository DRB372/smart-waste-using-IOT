const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const utils = require('./utils');

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
