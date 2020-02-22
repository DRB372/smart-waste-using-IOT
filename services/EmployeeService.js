class EmployeeService {
  constructor(db) {
    this.db = db;
  }

  getEmployees(callback) {
    this.db.query('SELECT * FROM employee', callback);
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
          avatar: null,
          employee_type: data.employee_type,
          shift: data.shift,
          account_no: data.account_no,
          passwrd: data.passwrd,
          person_id: result.insertId,
        };

        this.db.query('INSERT INTO employee SET ?', employeeData, callback);
      }
    });
  }
}

module.exports = EmployeeService;
