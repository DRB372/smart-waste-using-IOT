const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = params => {
  const { employeeService } = params;

  router.get('/', (req, res) => {
    employeeService.getEmployees((err, result) => {
      if (err) {
        throw err;
      } else {
        return res.render('layout', {
          title: 'Employees',
          template: 'employee/index',
          employees: result,
        });
      }
    });
  });

  router.get('/profile/:employeeId', (req, res) => {
    employeeService.getEmployeeById(req.params.employeeId, (err, result) => {
      if (err) {
        throw err;
      } else {
        return res.render('layout', {
          title: result[0] ? result[0].full_name : 'N/A',
          template: 'employee/detail',
          employee: result[0],
        });
      }
    });
  });

  router.get('/new', (req, res) => {
    const errors = req.session.employee ? req.session.employee.errors : false;
    const employeeId = req.session.employee ? req.session.employee.employeeId : false;
    req.session.employee = {};

    res.render('layout', {
      title: 'Add Employee',
      template: 'employee/new',
      errors,
      employeeId,
    });
  });

  router.post(
    '/new',
    [
      check('full_name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A name is required'),
      check('cnic')
        .trim()
        .isLength({ min: 15, max: 15 })
        .escape()
        .withMessage('A valid CNIC is required'),
      check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A valid email is required'),
      check('contact')
        .isLength({ min: 12, max: 12 })
        .escape()
        .withMessage('A valid contact is required'),
      check('dob')
        .not()
        .isEmpty()
        .withMessage('Date of birth is required'),
      check('gender')
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage('Gender is required'),
      check('home_address')
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage('An address is required'),
      check('employee_type')
        .not()
        .isEmpty()
        .withMessage('Employee type is required'),
      check('shift')
        .not()
        .isEmpty()
        .withMessage('Shift type is required'),
      check('account_no')
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage('A valid account number is required'),
      check('passwrd')
        .trim()
        .isLength({ min: 6 })
        .escape()
        .withMessage('A valid password is required'),
    ],
    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.employee = { errors: errors.array() };
        return res.redirect('/employee/new');
      }

      employeeService.addEmployee(req.body, (err, result) => {
        if (err) {
          throw err;
        } else {
          req.session.employee = { employeeId: result.insertId };
          return res.redirect('/employee/new');
        }
      });
    }
  );

  return router;
};
