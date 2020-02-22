const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'swc_db',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected!');
});

const EmployeeService = require('./services/EmployeeService');
const AvatarService = require('./services/AvatarService');

const employeeService = new EmployeeService(db);
const avatars = new AvatarService(path.join(__dirname, './data/avatars'));
const routes = require('./routes');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['asadqwqwgfdgf', 'qewr213552345dsf'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes({ employeeService, avatars }));

app.listen(port, () => {
  console.log(`Express server listening port on ${port}!`);
});
