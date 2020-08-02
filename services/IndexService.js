class IndexService {
  constructor(db) {
    this.db = db;
  }

  async getEmployeeCount() {
    const sql = `select count(employee_id) As Count from employee `;

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
    const sql = `select count(vehicle_id) As Count from vehicle WHERE is_active=TRUE`;

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
    const sql = `select count(bin_id) As Count from bins WHERE is_active=TRUE`;

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

  async getTrackCount() {
    const sql = `select count(track_id) As Count from track WHERE is_active=TRUE`;

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
