class IndexService {
  constructor(db) {
    this.db = db;
  }

  async getEmployeeCount() {
    const sql = `select count(employee_id) As Count from employee`;

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

  async getVehicleCount() {
    const sql = `select count(vehicle_id) As Count from vehicle`;

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

  async getBinsCount() {
    const sql = `select count(bin_id) As Count from bins`;

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


}
module.exports = IndexService;
