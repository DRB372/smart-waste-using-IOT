class EmployeeService {
  constructor(db) {
    this.db = db;
  }

  async getEmployees() {
    const sql = `SELECT
      E.employee_id, P.full_name, P.gender, P.cnic, P.contact, P.email, E.employee_type, E.shift
    FROM person AS P
      JOIN employee AS E ON E.person_id = P.person_id;
    `;

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async getEmployeeById(uid) {
    const sql = `SELECT E.employee_id, P.full_name, P.gender, P.cnic, P.contact,
    P.email, P.dob, P.home_address,
    E.avatar, E.employee_type, E.shift, E.account_no, E.created_at
    FROM person AS P
    JOIN employee AS E ON E.person_id = P.person_id
    WHERE E.employee_id = ?`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, uid, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => {
      return resp.length === 0 ? null : resp[0];
    });
  }

  async addEmployee(data) {
    const personData = {
      full_name: data.full_name,
      cnic: data.cnic,
      home_address: data.home_address,
      gender: data.gender,
      contact: data.contact,
      email: data.email,
      dob: data.dob,
    };

    return new Promise((resolve, reject) => {
      this.db.query('INSERT INTO person SET ?', personData, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(async resp => {
      const employeeData = {
        avatar: data.avatar,
        employee_type: data.employee_type,
        shift: data.shift,
        account_no: data.account_no,
        passwrd: data.passwrd,
        created_at: new Date(),
        person_id: resp.insertId,
      };

      return new Promise((resolve, reject) => {
        this.db.query('INSERT INTO employee SET ?', employeeData, (err, result) => {
          if (!err) {
            resolve(result);
          }
          else {
            reject(err);
          }
        });
      }).then(respN => respN.insertId);
    });
  }
}

module.exports = EmployeeService;
