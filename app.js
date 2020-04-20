const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const createError = require('http-errors');

const auth = require('./lib/auth');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected!');
});
const VehicleService = require('./services/VehicleService');
const EmployeeService = require('./services/EmployeeService');
const BinService = require('./services/BinService');
const AvatarService = require('./services/AvatarService');
const IndexService = require('./services/IndexService');


const employeeService = new EmployeeService(db);
const avatars = new AvatarService(path.join(__dirname, './data/avatars'));
const vehicleService = new VehicleService(db);
const binService = new BinService(db);
const indexService = new IndexService(db);
const routes = require('./routes');

const app = express();

const port = 3000;

// sessions setup
app.set('trust proxy', 1);
app.use(session({
  secret: 'very secret',
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));

// init passport
const passportConf = auth.passportConfig({employeeService});
app.use(passportConf.initialize);
app.use(passportConf.session);
app.use(passportConf.setUser);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  '/',
  routes({
    vehicleService,
    employeeService,
    binService,
    indexService,
    avatars,
  })
);

app.use((req, res, next) => {
  return next(createError(404, "Sorry but we couldn't find this page"));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express server listening port on ${port}!`);
});
