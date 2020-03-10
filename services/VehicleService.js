class VehicleService {
  constructor(db) {
    this.db = db;
  }

  async getVehicles() {
    const sql = `SELECT
      vehicle_id,full_name, reg_no,model From vehicle where is_active="1"`;

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

  async getVehicleById(uid) {
    const sql = `SELECT * FROM vehicle
    WHERE vehicle_id = ?`;

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

  async addNewVehicle(data) {
    const vehicleData = {
      full_name: data.full_name,
      reg_no: data.reg_no,
      model: data.model,
      avatar: data.avatar,
      remarks: data.remarks,
      created_at: new Date(),
    };

    return new Promise((resolve, reject) => {
      this.db.query('INSERT INTO vehicle SET ?', vehicleData, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  }

  async updateVehicleById(uid, data) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE vehicle
      SET ? WHERE vehicle_id = ?`;
      this.db.query(sql, [data, uid], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    }).then(resp => resp);
  }

  async deleteVehicleById(uid) {
    return new Promise((resolve, reject) => {
      const sql = ` UPDATE vehicle 
      SET is_active="0" WHERE vehicle_id = ?`;
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

module.exports = VehicleService;
