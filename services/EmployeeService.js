class EmployeeService {
  constructor(db) {
    this.db = db;
  }

  async getEmployees() {
    const sql = `SELECT
      E.employee_id, P.full_name, P.gender, P.cnic, P.contact, P.email, E.employee_type, E.shift
    FROM person AS P
      JOIN employee AS E ON E.person_id = P.person_id where is_active="1";
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
    E.avatar, E.employee_type, E.shift, E.bank_account, P.created_at
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

  async getEmployeeByEmail(email) {
    const sql = `SELECT E.employee_id, P.email, E.passwrd
      FROM person AS P
        JOIN employee AS E
          ON E.person_id = P.person_id
    WHERE P.email = ?`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, email, (err, result) => {
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
      created_at: new Date(),
      dob: data.dob,
      remarks: data.remarks,
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
        bank_account: data.bank_account,
        passwrd: data.passwrd,
        person_id: resp.insertId,
      };

      return new Promise((resolve, reject) => {
        this.db.query('INSERT INTO employee SET ?', employeeData, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });
      }).then(respN => respN.insertId);
    });
  }

  async updateEmployeeById(uid, data) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE employee AS E JOIN person AS P ON E.person_id = P.person_id
      SET ? WHERE employee_id = ?`;
      this.db.query(sql, [data, uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async deleteEmployeeById(uid) {
    return new Promise((resolve, reject) => {
      const sql = ` UPDATE person AS p JOIN employee AS E ON p.person_id = E.person_id
      SET is_active="0" WHERE employee_id = ?`;
      this.db.query(sql, [uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }
}

module.exports = EmployeeService;
