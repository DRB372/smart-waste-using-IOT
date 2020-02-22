class EmployeeService {
  constructor(db) {
    this.db = db;
  }

  getEmployees(callback) {
    this.db.query(
      `SELECT
      E.employee_id, P.full_name, P.gender, P.cnic, P.contact, P.email, E.employee_type, E.shift
      FROM
      person AS P
      JOIN employee AS E ON E.person_id = P.person_id;
    `,
      callback
    );
  }

  getEmployeeById(uid, callback) {
    const sql = `SELECT E.employee_id, P.full_name, P.gender, P.cnic, P.contact,
    P.email, P.dob, P.home_address,
    E.avatar, E.employee_type, E.shift, E.account_no, E.created_at
    FROM person AS P
    JOIN employee AS E ON E.person_id = P.person_id
    WHERE E.employee_id = ?`;

    this.db.query(sql, uid, callback);
  }

  addEmployee(data, callback) {
    const personData = {
      full_name: data.full_name,
      cnic: data.cnic,
      home_address: data.home_address,
      gender: data.gender,
      contact: data.contact,
      email: data.email,
      dob: data.dob,
    };

    this.db.query('INSERT INTO person SET ?', personData, (error, result) => {
      if (error) {
        throw error;
      } else {
        const employeeData = {
          avatar: data.avatar,
          employee_type: data.employee_type,
          shift: data.shift,
          account_no: data.account_no,
          passwrd: data.passwrd,
          created_at: new Date(),
          person_id: result.insertId,
        };

        this.db.query('INSERT INTO employee SET ?', employeeData, callback);
      }
    });
  }
}

module.exports = EmployeeService;
